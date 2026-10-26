const $ = id => document.getElementById(id);
const fmt = n => String(Number(n.toFixed(2)));
const input = $("km");

function render() {
  const p = Calculator.parse(input.value);
  const err = $("error"), out = $("result");
  err.textContent = p.error || "";
  input.setAttribute("aria-invalid", p.error ? "true" : "false");
  out.hidden = !p.ok;
  if (!p.ok) return;

  const r = Calculator.calculate(p.value);
  const [t1, t2] = r.tiers, f = CONFIG.freeKm;
  $("total").textContent = fmt(r.total);
  $("b-entered").textContent = fmt(r.entered) + " كم";
  $("b-free").textContent = fmt(r.free) + " كم";
  $("b-charge").textContent = fmt(r.chargeable) + " كم";
  $("b-t1").textContent = fmt(t1.km) + " كم";
  $("b-t2").textContent = fmt(t2.km) + " كم";
  $("b-total").textContent = fmt(r.total) + " جنيه";

  // الشريط المرسوم
  const w = r.entered || 1;
  $("seg-free").style.flexGrow = r.free / w;
  $("seg-t1").style.flexGrow = t1.km / w;
  $("seg-t2").style.flexGrow = t2.km / w;

  // شرح الحساب خطوة بخطوة
  const steps = [`المسافة الكاملة اللي كتبتها (زي جوجل ماب): <b>${fmt(r.entered)} كم</b>.`];
  if (r.chargeable === 0) {
    steps.push(`أول ${f} كم غير محسوبة، والمسافة دي كلها ضمنها، فالمبلغ <b>0 جنيه</b>.`);
  } else {
    steps.push(`نخصم أول ${f} كم لأنها غير محسوبة: ${fmt(r.entered)} − ${f} = <b>${fmt(r.chargeable)} كم</b>. ده <b>صافي المسافة</b>، وهو الرقم اللي بيظهر في شاشة الدفعات بالتطبيق.`);
    steps.push(`أول ${fmt(t1.km)} كم من الصافي بسعر ${t1.rate} جنيه: ${fmt(t1.km)} × ${t1.rate} = <b>${fmt(t1.amount)} جنيه</b>.`);
    steps.push(t2.km > 0
      ? `الباقي ${fmt(t2.km)} كم بسعر ${t2.rate} جنيه: ${fmt(t2.km)} × ${t2.rate} = <b>${fmt(t2.amount)} جنيه</b>.`
      : `مفيش كيلومترات زيادة بعد كده، فشريحة ${t2.rate} جنيه مش بتتحسب.`);
    steps.push(`الإجمالي: ${fmt(t1.amount)} + ${fmt(t2.amount)} = <b>${fmt(r.total)} جنيه</b>.`);
  }
  $("steps").innerHTML = steps.map(s => `<li>${s}</li>`).join("");
}

input.addEventListener("input", render);
$("reset").addEventListener("click", () => { input.value = ""; render(); input.focus(); });
render();
