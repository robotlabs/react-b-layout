const Metadata = {
  seasonActive: ['Summer','Winter', 'Total'],
  germanyMetadata: null,
  landMetadata: null,
  landkriesMetadata: null,
  mergeMetadataSummer: null,
  mergeMetadataWinter: null,
  mergeMetadataTotal: null,
  strings: {
    Summer: 'SUMMER + ALL SEASON',
    Winter: 'WINTER',
    Total: 'TOTAL',
    Geo: 'LAND VIEW',
    CarDealer: 'CAR DEALER PORTFOLIO VIEW',
    TyreTrade: 'TYRE TRADE PORTFOLIO VIEW',
    All: 'ALL'
  },
  digestMetadata(data, seasonId) {
    let m = data.metadata;
    this.mergeMetadataSummer = {...m.Germany.summer, ...m.land.summer, ...m.landkreis.summer, ...m.car_park.summer, ...m.pos.summer, ...m.postcodes.summer};
    this.mergeMetadataWinter = {...m.Germany.winter, ...m.land.winter, ...m.landkreis.winter, ...m.car_park.winter, ...m.pos.winter, ...m.postcodes.winter};
    this.mergeMetadataTotal = {...m.Germany.total, ...m.landkreis.total, ...m.car_park.total, ...m.pos.total, ...m.postcodes.total,...m.land.total};
    this.updateSeason(this.seasonActive[seasonId]);
  },
  updateSeason(season) {
    let m = this['mergeMetadata' + season];
    this.o = {
      ...m,
      ...this.strings
    };
    this.o.season = this.strings[season];

    let mTotal = this.mergeMetadataTotal;

    this.o.pirelli_sellin_total = {
      label: mTotal.pirelli_sellin.label,
      key: mTotal.pirelli_sellin.key
    };
    this.o.prestige_car_parc_total = {
      label: mTotal.prestige_car_parc.label,
      key: mTotal.prestige_car_parc.key
    };
    this.o.tyre_potential_total = {
      label: mTotal.tyre_potential.label,
      key: mTotal.tyre_potential.key
    };
    this.o.market_share_total = {
      label: mTotal.market_share.label,
      key: mTotal.market_share.key
    };
  }
};

export default Metadata;
