const { createClient } = require("@supabase/supabase-js");

const MAX_TOTAL = 320;

let supabaseClient;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables",
    );
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
}

function mapRow(r) {
  const total = Number(r.total);
  const pct = Math.round((total / MAX_TOTAL) * 1000) / 10;
  const status = String(r.status || "").trim();
  const pass = status.includes("ناجح");
  const grade =
    pct >= 90
      ? "ممتاز"
      : pct >= 80
        ? "جيد جدًا"
        : pct >= 65
          ? "جيد"
          : pct >= 50
            ? "مقبول"
            : "راسب";

  return {
    seat: String(r.seat).trim(),
    name: String(r.name).trim(),
    total,
    maxTotal: MAX_TOTAL,
    pct,
    status,
    pass,
    grade,
  };
}

async function findStudent(q) {
  const supabase = getSupabase();

  if (/^\d+$/.test(q)) {
    const { data, error } = await supabase
      .from("students")
      .select("seat, name, total, status")
      .eq("seat", q)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRow(data) : null;
  }

  const { data, error } = await supabase
    .from("students")
    .select("seat, name, total, status")
    .ilike("name", `%${q}%`)
    .limit(1);

  if (error) throw error;
  return data && data.length ? mapRow(data[0]) : null;
}

async function getSuggestions(q) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("students")
    .select("seat, name")
    .ilike("name", `%${q}%`)
    .limit(5);

  if (error) throw error;

  return (data || []).map((r) => ({
    seat: String(r.seat).trim(),
    name: String(r.name).trim(),
  }));
}

async function getStats() {
  const supabase = getSupabase();

  const { data, error } = await supabase.rpc("get_student_stats");
  if (!error && data && data.length) {
    return {
      average: Number(data[0].average),
      count: Number(data[0].count),
    };
  }

  const { count, error: countError } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  return { average: null, count: count ?? 0 };
}

module.exports = { findStudent, getSuggestions, getStats, MAX_TOTAL };
