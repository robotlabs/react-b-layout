//** CAR PARK
export const arrCarparkTableVar = (ap) => {
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

export const arrCarparkTableFixed = (ap) => {
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
export const arrPosActiveVar = (ap) => {
  return ([]);
};

export const arrPosActiveFixed = (ap) => {
  return (
  [
    ap.typology,
    ap.subtipology,
    ap.pos_name,
    ap.pos_address,
    ap.territory_declared_potential,
    ap.territory_pirelli_volumes
  ]
  );
};

export const arrPosProspectVar = (ap) => {
  return ([]);
};

export const arrPosProspectFixed = (ap) => {
  return (
  [
    ap.typology,
    ap.subtipology,
    ap.pos_name,
    ap.pos_address,
    ap.territory_declared_potential
  ]
  );
};

//** PROSPECT
export const arrProspectVar = (ap) => {
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

export const arrProspectFixed = (ap) => {
  return (
  [
    ap.territory_declared_potential//,
    // ap.territory_direct_volumes,
    // ap.territory_indirect_volumes
  ]
  );
};
