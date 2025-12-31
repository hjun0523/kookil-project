// 숫자를 천 단위 콤마 문자열로 변환 (예: 10000 -> 10,000)
export const formatPrice = (price) => {
  if (price === 0 || price === '0') return '가격협의';
  if (!price) return '';
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

// 날짜 포맷 (YYYY-MM-DD)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};