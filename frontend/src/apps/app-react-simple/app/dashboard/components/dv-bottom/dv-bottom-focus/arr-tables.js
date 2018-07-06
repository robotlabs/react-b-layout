export const arrCarparkLevels = (ap) => {
  return (
  [
    ap.brand,
    ap.nameplate,
    ap.program,
    ap.rim,
    ap.size
  ]
  );
};

export const arrCarparkValues = (ap) => {
  return (
  [
    ap.vehicles_count,
    ap.tyre_potential,
    ap.pullthrough_potential,
    ap.pirelli_volumes,
    ap.gap
  ]
  );
};

//** TERRITORY
export const arrTerritoryTableVar = (ap) => {
  return (
  [
    ap.macrotypology,
    ap.typology,
    ap.subtipology,
    ap.pos_name,
    ap.pos_address
  ]
  );
};

export const arrTerritoryTableFixed = (ap) => {
  return (
  [
    ap.territory_declared_potential,
    ap.territory_direct_volumes,
    ap.territory_indirect_volumes
  ]
  );
};
