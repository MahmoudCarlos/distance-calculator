// حالات الاختبار: [المسافة، المبلغ المتوقع]
function runTests() {
  const cases = [[0,0],[1,0],[2,0],[3,1],[4,2],[5,3],[6,6],[7,9],[10,18],[2.5,0.5],
    [11.1667,21.5],   // طلب حقيقي: 9.2 كم قابلة للدفع ← 21.50
    [7.3433,10.03]];  // طلب حقيقي: 5.3 كم قابلة للدفع ← 10.03
  const res = cases.map(([d, exp]) => {
    const got = Calculator.calculate(d).total;
    return { name: `${d} كم ← ${exp} جنيه`, pass: Math.abs(got - exp) < 0.01, exp, got };
  });
  const bad = [["",null],["-3",null],["abc",null],["1e3",null],["٣",3],["2,5",2.5]];
  bad.forEach(([txt, v]) => {
    const p = Calculator.parse(txt);
    res.push({ name: `إدخال "${txt}" ${v === null ? "مرفوض" : "= " + v}`, pass: v === null ? !p.ok : p.value === v, exp: v, got: p.value });
  });
  return res;
}
if (typeof module !== "undefined") module.exports = runTests;
