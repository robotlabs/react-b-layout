export const layout =  {
  breakpoints: [
    {
      //** if you want to extend to all page, without breakpoints
      interval: [0, -1],
      layout: {
        margins: 20,
        overlay: {
          w: 20,
          h: 100,
          l: 80,
          t: 0,
          id: 'dv-1'
        },
        rows: [
          //** row 1
          {
            h: 70,
            columns: [
              {
                w: 50,
                id: 'dv-2'
              },
              {
                w: 50,
                id: 'dv-3'
              }
            ]
          },
          //** row 2
          {
            h: 30,
            columns: [
              {
                w: 100,
                id: 'dv-4'
              }
            ]
          }
        ]
      }
    }
  ]
};
