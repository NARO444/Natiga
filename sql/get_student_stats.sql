-- Run once in Supabase → SQL Editor (needed for accurate batch average on large tables)

create or replace function get_student_stats()
returns table (average numeric, count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    round(avg(total::numeric) / 320.0 * 100, 1) as average,
    count(*)::bigint as count
  from students;
$$;

grant execute on function get_student_stats() to service_role;
