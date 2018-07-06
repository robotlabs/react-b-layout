
export const layout =  {
  //** all layouts are separated in breakpoints.
  //+interval is the width interval where the layout will be applied
  //+margins is the margin between the component and the page
  //+rows are listed as an array. they have a percentage h, and an array of columns, where you can definy w and optional h
  breakpoints: [
    {
      interval: [0, 600],
      layout: {
        margins: 5,
        rows: [
          {
            h: 40,
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
          {
            h: 60,
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
          }
        ]
      }
    },
    {
      interval: [601, 1200],
      layout: {
        margins: 10,
        rows: [
          {
            h: 30,
            columns: [
              {
                w: 30,
                id: 'component1'
              },
              {
                w: 50,
                h: 0,
                id: 'component2'
              },
              {
                w: 20,
                id: 'component3'
              }
            ]
          },
          {
            h: 70,
            columns: [
              {
                w: 50,
                id: 'component4'
              },
              {
                w: 50,
                id: 'component5'
              }
            ]
          }
        ]
      }
    },
    {
      interval: [1201, -1],
      layout: {
        margins: 10,
        rows: [
          {
            h: 30,
            columns: [
              {
                w: 80,
                id: 'component1'
              },
              {
                w: 20,
                h: 0,
                id: 'component2'
              }
            ]
          },
          {
            h: 40,
            columns: [
              {
                w: 50,
                id: 'component4'
              },
              {
                w: 50,
                id: 'component5'
              }
            ]
          },
          {
            h: 30,
            columns: [
              {
                w: 100,
                id: 'component3'
              }
            ]
          }
        ]
      }
    }
  ]
};
