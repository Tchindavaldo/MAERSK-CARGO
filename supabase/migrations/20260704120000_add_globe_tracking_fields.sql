/*
  # Champs de suivi sur globe terrestre

  Ajoute à `jongleur_maersk_shipments` :
    - `origin_country` (text) : code ISO-2 du pays de départ (ex: CN)
    - `destination_country` (text) : code ISO-2 du pays d'arrivée (ex: CM)
    - `transport_mode` (text) : 'sea' (bateau) ou 'air' (avion)
    - `total_duration_days` (integer) : durée totale du trajet en jours,
      utilisée pour calculer automatiquement la progression quotidienne
*/

ALTER TABLE jongleur_maersk_shipments
  ADD COLUMN IF NOT EXISTS origin_country text DEFAULT '',
  ADD COLUMN IF NOT EXISTS destination_country text DEFAULT '',
  ADD COLUMN IF NOT EXISTS transport_mode text DEFAULT 'sea',
  ADD COLUMN IF NOT EXISTS total_duration_days integer DEFAULT 0;
