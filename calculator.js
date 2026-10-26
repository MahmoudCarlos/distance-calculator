// منطق الحساب فقط (من غير أي علاقة بالشاشة)
const Calculator = {
  // يحوّل النص لرقم، ويرجع { ok, value } أو { ok:false, error }
  parse(text, cfg = CONFIG) {
    let s = String(text ?? "").trim();
    if (s === "") return { ok: false, empty: true };
    s = s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[٫,،]/g, ".");
    if (s.startsWith("-")) return { ok: false, error: "المسافة لا يمكن أن تكون سالبة." };
    if (!/^\d+(\.\d+)?$/.test(s)) return { ok: false, error: "اكتب أرقاماً فقط، مثال: 7.3" };
    const value = Number(s);
    if (value > cfg.maxKm) return { ok: false, error: "المسافة كبيرة جداً، راجع الرقم." };
    return { ok: true, value };
  },

  calculate(distance, cfg = CONFIG) {
    const free = Math.min(distance, cfg.freeKm);
    const chargeable = Math.max(distance - cfg.freeKm, 0);
    let left = chargeable, total = 0;
    const tiers = cfg.tiers.map(t => {
      const km = Math.min(left, t.km);
      left -= km;
      const amount = km * t.rate;
      total += amount;
      return { km, rate: t.rate, amount };
    });
    return { entered: distance, free, chargeable, tiers, total: Math.round(total * 100) / 100 };
  }
};
