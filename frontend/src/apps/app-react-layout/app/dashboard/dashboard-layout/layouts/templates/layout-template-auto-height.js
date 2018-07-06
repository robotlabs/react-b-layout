export const layout =  {
  breakpoints: [
    {
      //** if you want to extend to all page, without breakpoints
      interval: [0, -1],
      layout: {
        margins: 3,
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
                h: 70,
                id: 'component5'
              }
            ]
          },
          //** row 3
          {
            h: 40,
            columns: [
              {
                w: 67,
                id: 'component8'
              }
            ]
          }
        ]
      }
    }
  ]
};
