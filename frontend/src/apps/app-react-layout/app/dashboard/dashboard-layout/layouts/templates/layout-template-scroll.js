export const layout =  {
  breakpoints: [
    {
      interval: [0, -1],
      layout: {
        margins: 20,
        rows: [
          //** row 1
          {
            h: 30,
            columns: [
              {
                w: 50,
                id: 'component1'
              },
              {
                w: 50,
                id: 'component2'
              }
            ]
          },
          //** row 2
          {
            h: 30,
            columns: [
              {
                w: 33,
                id: 'component3'
              },
              {
                w: 34,
                id: 'component4'
              },
              {
                w: 33,
                id: 'component5'
              }
            ]
          },
          //** row 3
          {
            h: 'auto',
            columns: [
              {
                w: 100,
                id: 'component10'
              }
            ]
          },
          //** row 4
          {
            h: 20,
            columns: [
              {
                w: 25,
                id: 'component6'
              },
              {
                w: 25,
                id: 'component7'
              },
              {
                w: 25,
                id: 'component8'
              },
              {
                w: 25,
                id: 'component9'
              }
            ]
          }
        ]
      }
    }
  ]
};
