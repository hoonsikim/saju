#!/usr/bin/env bash
# Saju QA 자동 실행 — 매 push 전 / cron work-tick에서 호출.
# 32 체크 항목 (QA-CHECKLIST.md). fail 1개라도 있으면 exit 1.
#
# 사용:
#   bash bin/qa.sh           — 라이브 URL (https://hoonsikim.github.io/saju)
#   URL=http://localhost:8765 bash bin/qa.sh  — 로컬

set -u
URL=${URL:-https://hoonsikim.github.io/saju}
B=${B:-/Users/shkim/.claude/skills/gstack/browse/dist/browse}

PASS=0
FAIL=0
SKIP=0

pass() { echo "✓ $1"; PASS=$((PASS+1)); }
fail() { echo "✗ $1 — $2"; FAIL=$((FAIL+1)); }
skip() { echo "○ $1 (skip: $2)"; SKIP=$((SKIP+1)); }

check() {
  local name="$1" actual="$2" expected="$3"
  if [[ "$actual" == *"$expected"* ]]; then pass "$name"; else fail "$name" "got '$actual', expected contains '$expected'"; fi
}

echo "=== Saju QA — $(date '+%H:%M:%S') — $URL ==="

# A. 페이지 로드
HTTP=$(curl -sIL -o /dev/null -w "%{http_code}" "$URL/")
check "A1 HTTP 200" "$HTTP" "200"

# B·G. 4언어 reading
for L in en ko ja zh; do
  $B goto "$URL/?lang=$L" >/dev/null 2>&1
  sleep 1
  $B click "#submit-btn" >/dev/null 2>&1
  sleep 3
  READING=$($B js 'document.getElementById("reading-text")?.textContent?.slice(0, 30)' 2>/dev/null | tail -1)
  case $L in
    en) check "G1 EN reading" "$READING" "Your Day Master" ;;
    ko) check "G2 KO reading" "$READING" "당신의 일주" ;;
    ja) check "G3 JA reading" "$READING" "あなたの日主" ;;
    zh) check "G4 ZH reading" "$READING" "你的日主" ;;
  esac
  TITLE=$($B js 'document.title' 2>/dev/null | tail -1)
  case $L in
    en) check "I1 EN title" "$TITLE" "Saju" ;;
    ko) check "I1 KO title" "$TITLE" "사주" ;;
    ja) check "I1 JA title" "$TITLE" "四柱" ;;
    zh) check "I1 ZH title" "$TITLE" "四柱" ;;
  esac
done

# D. 4 pillars (1990-01-01 case)
$B goto "$URL/?lang=en" >/dev/null 2>&1
sleep 1
$B fill "#birth-date" "1990-01-01" >/dev/null 2>&1
$B click "#submit-btn" >/dev/null 2>&1
sleep 3
PILLARS=$($B js 'Array.from(document.querySelectorAll(".pillar-cell")).map(c => Array.from(c.querySelectorAll(".pillar-chars")).map(e=>e.textContent).join("")).join(",")' 2>/dev/null | tail -1)
check "D1 1990-01-01 pillars" "$PILLARS" "己巳,丙子,丙寅,甲午"

# E. 5 elements
COUNT=$($B js 'document.querySelectorAll(".element-row").length' 2>/dev/null | tail -1)
check "E1 5 elements bars" "$COUNT" "5"
SUM=$($B js 'Array.from(document.querySelectorAll(".element-pct")).map(e=>parseInt(e.textContent)).reduce((a,b)=>a+b,0)' 2>/dev/null | tail -1)
if [ "$SUM" -ge 98 ] && [ "$SUM" -le 102 ]; then pass "E2 elements sum ≈ 100% ($SUM)"; else fail "E2 elements sum" "got $SUM, expected 98-102"; fi

# I. SEO
HREFLANG=$($B js 'document.querySelectorAll("link[hreflang]").length' 2>/dev/null | tail -1)
check "I4 hreflang ≥4" "$HREFLANG" "5"
JSONLD=$($B js 'JSON.parse(document.querySelector("script[type=\"application/ld+json\"]").textContent)["@type"]' 2>/dev/null | tail -1)
check "I5 JSON-LD WebApplication" "$JSONLD" "WebApplication"

# J. 모바일 — 1열
$B viewport "375x812" >/dev/null 2>&1
$B goto "$URL/?lang=en" >/dev/null 2>&1
sleep 1
ROW=$($B js 'getComputedStyle(document.querySelector("#saju-form .row")).gridTemplateColumns' 2>/dev/null | tail -1)
if [[ "$ROW" =~ ^[0-9.]+px$ ]]; then pass "J1 mobile form 1-col ($ROW)"; else fail "J1 mobile form" "got '$ROW'"; fi
$B viewport "1280x720" >/dev/null 2>&1

# H1·H2 — clipboard headless 한계
skip "H1 clipboard write" "headless browser limit"
skip "H2 copied feedback" "headless browser limit"

echo ""
echo "=== Result: $PASS pass · $FAIL fail · $SKIP skip ==="
[ "$FAIL" -gt 0 ] && exit 1 || exit 0
