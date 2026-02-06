export interface HistoricalEvent {
  id: string;
  name: string;
  revealText: string;
  startDate: string;
  endDate: string;
  stocks: string[];
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'dotcom-2000',
    name: 'Dot-Com Bubble',
    revealText: 'You just traded through the Dot-Com Bubble!',
    startDate: '2000-01-01',
    endDate: '2002-12-31',
    stocks: [
      'MSFT.US', 'INTC.US', 'CSCO.US', 'AAPL.US', 'ORCL.US',
      'IBM.US', 'HPQ.US', 'AMD.US', 'TXN.US', 'QCOM.US',
      'AMZN.US', 'XOM.US', 'GE.US', 'JNJ.US', 'PFE.US',
      'WMT.US', 'KO.US', 'DIS.US', 'MRK.US', 'PG.US',
    ],
  },
  {
    id: 'financial-crisis-2008',
    name: '2008 Financial Crisis',
    revealText: 'You survived the 2008 Financial Crisis!',
    startDate: '2007-09-01',
    endDate: '2009-06-30',
    stocks: [
      'JPM.US', 'BAC.US', 'GS.US', 'MS.US', 'C.US',
      'WFC.US', 'AIG.US', 'MET.US', 'PRU.US', 'BLK.US',
      'SCHW.US', 'USB.US', 'PNC.US', 'BK.US', 'STT.US',
      'AAPL.US', 'MSFT.US', 'GE.US', 'XOM.US', 'F.US',
    ],
  },
  {
    id: 'covid-2020',
    name: 'COVID-19 Crash',
    revealText: 'You just traded through the COVID-19 Crash!',
    startDate: '2020-01-01',
    endDate: '2020-12-31',
    stocks: [
      'AAPL.US', 'MSFT.US', 'AMZN.US', 'GOOGL.US', 'TSLA.US',
      'BA.US', 'DAL.US', 'UAL.US', 'AAL.US', 'MAR.US',
      'CCL.US', 'NCLH.US', 'DIS.US', 'XOM.US', 'CVX.US',
      'JPM.US', 'ZM.US', 'MRNA.US', 'PFE.US', 'NVDA.US',
    ],
  },
  {
    id: 'oil-crisis-2014',
    name: '2014 Oil Crisis',
    revealText: 'You survived the 2014 Oil Crisis!',
    startDate: '2014-03-01',
    endDate: '2015-06-30',
    stocks: [
      'XOM.US', 'CVX.US', 'COP.US', 'SLB.US', 'HAL.US',
      'OXY.US', 'MPC.US', 'VLO.US', 'PSX.US', 'EOG.US',
      'PXD.US', 'DVN.US', 'HES.US', 'APA.US', 'MRO.US',
    ],
  },
  {
    id: 'china-crash-2015',
    name: '2015 China Crash',
    revealText: 'You traded through the 2015 China Stock Crash!',
    startDate: '2015-03-01',
    endDate: '2016-06-30',
    stocks: [
      'BABA.US', 'JD.US', 'BIDU.US', 'FXI.US', 'MCHI.US',
      'AAPL.US', 'MSFT.US', 'INTC.US', 'CAT.US', 'DE.US',
      'BA.US', 'GE.US', 'IBM.US', 'MMM.US', 'HON.US',
    ],
  },
];

export const EVENT_TRIGGER_CHANCE = 7; // 1 in 7 chance

export const rollForEvent = (): HistoricalEvent | null => {
  const roll = Math.floor(Math.random() * EVENT_TRIGGER_CHANCE);
  if (roll !== 0) return null;
  return HISTORICAL_EVENTS[Math.floor(Math.random() * HISTORICAL_EVENTS.length)];
};
