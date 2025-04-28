update rendezvous
set
  date_jour = cast(date as date),
  heure = cast(to_char(date, 'HH24:MI') as time)
where date_jour is null or heure is null;
