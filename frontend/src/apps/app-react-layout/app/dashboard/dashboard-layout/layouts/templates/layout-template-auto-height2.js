export const layout =  {
  breakpoints: [
    {
      //** if you want to extend to all page, without breakpoints
      interval: [0, -1],
      layout: {
        margins: 5,
        rows: [
          //** row 1
          {
            h: 25,
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
            h: 25,
            columns: [
              {
                w: 25,
                h: 50,
                id: 'component3'
              },
              {
                w: 25,
                id: 'component4'
              },
              {
                w: 25,
                id: 'component5'
              },
              {
                w: 25,
                h: 75.5,
                id: 'component6'
              }
            ]
          },
          //** row 3
          {
            h: 25,
            columns: [
              {
                w: 50,
                l: 25,
                id: 'component8'
              }
            ]
          },
          //** row 4
          {
            h: 25,
            columns: [
              {
                w: 75,
                id: 'component7'
              }
            ]
          }
        ]
      }
    }
  ]
};
