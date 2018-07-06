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
            h: 50,
            columns: [

              {
                w: 65,
                id: 'dv-1'
              },
              {
                w: 35,
                id: 'dv-2'
              }
            ]
          },
          //** row 2

          {
            h: 50,
            columns: [
              {
                w: 50,
                id: 'dv-3'
              },
              {
                w: 50,
                id: 'dv-4'
              }
            ]
          }

        ]
      }
    }
  ]
};
