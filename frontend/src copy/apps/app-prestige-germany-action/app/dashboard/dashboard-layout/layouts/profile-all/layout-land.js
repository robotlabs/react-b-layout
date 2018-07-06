export const layout =  {
  breakpoints: [
    {
      //** if you want to extend to all page, without breakpoints
      interval: [0, -1],
      layout: {
        margins: 1,
        rows: [
          //** row 1
          {
            h: 70,
            columns: [

              {
                w: 65,
                id: 'dv-map'
              },
              {
                w: 35,
                id: 'dv-rightside'
              }
            ]
          },
          //** row 2
          {
            h: 30,
            columns: [
              {
                w: 100,
                id: 'dv-bottom'
              }
            ]
          }

        ]
      }
    }
  ]
};
