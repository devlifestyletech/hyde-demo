import React from 'react';
import { Modal, Button } from 'antd';
import addressServices from '../services/addressServices';

function AddNewAddress({ visible, onCancel }) {
  const addresses = [
    {
      address_number: '1199/1',
      room_number: 4401,
      room_type: 'P4',
      floor: 44,
    },
    {
      address_number: '1199/2',
      room_number: 4201,
      room_type: 'P1',
      floor: '42-43',
    },
    {
      address_number: '1199/3',
      room_number: 4205,
      room_type: 'P3',
      floor: '42-43',
    },
    {
      address_number: '1199/4',
      room_number: 4210,
      room_type: 'P2',
      floor: '42-43',
    },
    {
      address_number: '1199/5',
      room_number: 3801,
      room_type: 'D4',
      floor: 38,
    },
    {
      address_number: '1199/6',
      room_number: 3802,
      room_type: 'D6',
      floor: 38,
    },
    {
      address_number: '1199/7',
      room_number: 3809,
      room_type: 'D1',
      floor: 38,
    },
    {
      address_number: '1199/8',
      room_number: 3810,
      room_type: 'D5',
      floor: 38,
    },
    {
      address_number: '1199/9',
      room_number: 3701,
      room_type: 'D4',
      floor: 37,
    },
    {
      address_number: '1199/10',
      room_number: 3702,
      room_type: 'D6',
      floor: 37,
    },
    {
      address_number: '1199/11',
      room_number: 3709,
      room_type: 'D1',
      floor: 37,
    },
    {
      address_number: '1199/12',
      room_number: 3710,
      room_type: 'D5',
      floor: 37,
    },
    {
      address_number: '1199/13',
      room_number: 3601,
      room_type: 'C3',
      floor: 36,
    },
    {
      address_number: '1199/14',
      room_number: 3602,
      room_type: 'C3A',
      floor: 36,
    },
    {
      address_number: '1199/15',
      room_number: 3603,
      room_type: 'D5',
      floor: 36,
    },
    {
      address_number: '1199/16',
      room_number: 3608,
      room_type: 'C7',
      floor: 36,
    },
    {
      address_number: '1199/17',
      room_number: 3609,
      room_type: 'A3',
      floor: 36,
    },
    {
      address_number: '1199/18',
      room_number: 3610,
      room_type: 'B2',
      floor: 36,
    },
    {
      address_number: '1199/19',
      room_number: 3611,
      room_type: 'C6',
      floor: 36,
    },
    {
      address_number: '1199/20',
      room_number: 3501,
      room_type: 'C3',
      floor: 35,
    },
    {
      address_number: '1199/21',
      room_number: 3502,
      room_type: 'C1A',
      floor: 35,
    },
    {
      address_number: '1199/22',
      room_number: 3503,
      room_type: 'D3',
      floor: 35,
    },
    {
      address_number: '1199/23',
      room_number: 3508,
      room_type: 'C7',
      floor: 35,
    },
    {
      address_number: '1199/24',
      room_number: 3509,
      room_type: 'A3',
      floor: 35,
    },
    {
      address_number: '1199/25',
      room_number: 3510,
      room_type: 'B2',
      floor: 35,
    },
    {
      address_number: '1199/26',
      room_number: 3511,
      room_type: 'C6',
      floor: 35,
    },
    {
      address_number: '1199/27',
      room_number: 3401,
      room_type: 'C3',
      floor: 34,
    },
    {
      address_number: '1199/28',
      room_number: 3402,
      room_type: 'C1A',
      floor: 34,
    },
    {
      address_number: '1199/29',
      room_number: 3403,
      room_type: 'D3',
      floor: 34,
    },
    {
      address_number: '1199/30',
      room_number: 3408,
      room_type: 'C7',
      floor: 34,
    },
    {
      address_number: '1199/31',
      room_number: 3409,
      room_type: 'A3',
      floor: 34,
    },
    {
      address_number: '1199/32',
      room_number: 3410,
      room_type: 'B2',
      floor: 34,
    },
    {
      address_number: '1199/33',
      room_number: 3411,
      room_type: 'C6',
      floor: 34,
    },
    {
      address_number: '1199/34',
      room_number: 3301,
      room_type: 'C3',
      floor: 33,
    },
    {
      address_number: '1199/35',
      room_number: 3302,
      room_type: 'C1A',
      floor: 33,
    },
    {
      address_number: '1199/36',
      room_number: 3303,
      room_type: 'D3',
      floor: 33,
    },
    {
      address_number: '1199/37',
      room_number: 3308,
      room_type: 'C7',
      floor: 33,
    },
    {
      address_number: '1199/38',
      room_number: 3309,
      room_type: 'A3',
      floor: 33,
    },
    {
      address_number: '1199/39',
      room_number: 3310,
      room_type: 'B2',
      floor: 33,
    },
    {
      address_number: '1199/40',
      room_number: 3311,
      room_type: 'C6',
      floor: 33,
    },
    {
      address_number: '1199/41',
      room_number: 3201,
      room_type: 'C3',
      floor: 32,
    },
    {
      address_number: '1199/42',
      room_number: 3202,
      room_type: 'C1A',
      floor: 32,
    },
    {
      address_number: '1199/43',
      room_number: 3203,
      room_type: 'D3',
      floor: 32,
    },
    {
      address_number: '1199/44',
      room_number: 3208,
      room_type: 'C7',
      floor: 32,
    },
    {
      address_number: '1199/45',
      room_number: 3209,
      room_type: 'A3',
      floor: 32,
    },
    {
      address_number: '1199/46',
      room_number: 3210,
      room_type: 'B2',
      floor: 32,
    },
    {
      address_number: '1199/47',
      room_number: 3211,
      room_type: 'C6',
      floor: 32,
    },
    {
      address_number: '1199/48',
      room_number: 3101,
      room_type: 'C3',
      floor: 31,
    },
    {
      address_number: '1199/49',
      room_number: 3102,
      room_type: 'C1A',
      floor: 31,
    },
    {
      address_number: '1199/50',
      room_number: 3103,
      room_type: 'D3',
      floor: 31,
    },
    {
      address_number: '1199/51',
      room_number: 3108,
      room_type: 'C7',
      floor: 31,
    },
    {
      address_number: '1199/52',
      room_number: 3109,
      room_type: 'A3',
      floor: 31,
    },
    {
      address_number: '1199/53',
      room_number: 3110,
      room_type: 'B2',
      floor: 31,
    },
    {
      address_number: '1199/54',
      room_number: 3111,
      room_type: 'C6',
      floor: 31,
    },
    {
      address_number: '1199/55',
      room_number: 3001,
      room_type: 'C3',
      floor: 30,
    },
    {
      address_number: '1199/56',
      room_number: 3002,
      room_type: 'C1A',
      floor: 30,
    },
    {
      address_number: '1199/57',
      room_number: 3003,
      room_type: 'D3',
      floor: 30,
    },
    {
      address_number: '1199/58',
      room_number: 3008,
      room_type: 'C7',
      floor: 30,
    },
    {
      address_number: '1199/59',
      room_number: 3009,
      room_type: 'A3',
      floor: 30,
    },
    {
      address_number: '1199/60',
      room_number: 3010,
      room_type: 'B2',
      floor: 30,
    },
    {
      address_number: '1199/61',
      room_number: 3011,
      room_type: 'C6',
      floor: 30,
    },
    {
      address_number: '1199/62',
      room_number: 2901,
      room_type: 'C3',
      floor: 29,
    },
    {
      address_number: '1199/63',
      room_number: 2902,
      room_type: 'C1B',
      floor: 29,
    },
    {
      address_number: '1199/64',
      room_number: 2903,
      room_type: 'D7',
      floor: 29,
    },
    {
      address_number: '1199/65',
      room_number: 2909,
      room_type: 'D2',
      floor: 29,
    },
    {
      address_number: '1199/66',
      room_number: 2910,
      room_type: 'C2',
      floor: 29,
    },
    {
      address_number: '1199/67',
      room_number: 2911,
      room_type: 'C6',
      floor: 29,
    },
    {
      address_number: '1199/68',
      room_number: 2801,
      room_type: 'C3',
      floor: 28,
    },
    {
      address_number: '1199/69',
      room_number: 2808,
      room_type: 'B1',
      floor: 28,
    },
    {
      address_number: '1199/70',
      room_number: 2803,
      room_type: 'C1',
      floor: 28,
    },
    {
      address_number: '1199/71',
      room_number: 2804,
      room_type: 'C5',
      floor: 28,
    },
    {
      address_number: '1199/72',
      room_number: 2805,
      room_type: 'B3',
      floor: 28,
    },
    {
      address_number: '1199/73',
      room_number: 2806,
      room_type: 'C4',
      floor: 28,
    },
    {
      address_number: '1199/74',
      room_number: 2807,
      room_type: 'A3',
      floor: 28,
    },
    {
      address_number: '1199/75',
      room_number: 2808,
      room_type: 'A3',
      floor: 28,
    },
    {
      address_number: '1199/76',
      room_number: 2809,
      room_type: 'A3',
      floor: 28,
    },
    {
      address_number: '1199/77',
      room_number: 2810,
      room_type: 'B2',
      floor: 28,
    },
    {
      address_number: '1199/78',
      room_number: 2811,
      room_type: 'C6',
      floor: 28,
    },
    {
      address_number: '1199/79',
      room_number: 2701,
      room_type: 'C3',
      floor: 27,
    },
    {
      address_number: '1199/80',
      room_number: 2702,
      room_type: 'B1',
      floor: 27,
    },
    {
      address_number: '1199/81',
      room_number: 2703,
      room_type: 'C1',
      floor: 27,
    },
    {
      address_number: '1199/82',
      room_number: 2704,
      room_type: 'C5',
      floor: 27,
    },
    {
      address_number: '1199/83',
      room_number: 2705,
      room_type: 'B3',
      floor: 27,
    },
    {
      address_number: '1199/84',
      room_number: 2706,
      room_type: 'C4',
      floor: 27,
    },
    {
      address_number: '1199/85',
      room_number: 2707,
      room_type: 'A3',
      floor: 27,
    },
    {
      address_number: '1199/86',
      room_number: 2708,
      room_type: 'A3',
      floor: 27,
    },
    {
      address_number: '1199/87',
      room_number: 2709,
      room_type: 'A3',
      floor: 27,
    },
    {
      address_number: '1199/88',
      room_number: 2710,
      room_type: 'B2',
      floor: 27,
    },
    {
      address_number: '1199/89',
      room_number: 2711,
      room_type: 'C6',
      floor: 27,
    },
    {
      address_number: '1199/90',
      room_number: 2601,
      room_type: 'C3',
      floor: 26,
    },
    {
      address_number: '1199/91',
      room_number: 2602,
      room_type: 'B1',
      floor: 26,
    },
    {
      address_number: '1199/92',
      room_number: 2603,
      room_type: 'C1',
      floor: 26,
    },
    {
      address_number: '1199/93',
      room_number: 2604,
      room_type: 'C5',
      floor: 26,
    },
    {
      address_number: '1199/94',
      room_number: 2605,
      room_type: 'B3',
      floor: 26,
    },
    {
      address_number: '1199/95',
      room_number: 2606,
      room_type: 'C4',
      floor: 26,
    },
    {
      address_number: '1199/96',
      room_number: 2607,
      room_type: 'A3',
      floor: 26,
    },
    {
      address_number: '1199/97',
      room_number: 2608,
      room_type: 'A3',
      floor: 26,
    },
    {
      address_number: '1199/98',
      room_number: 2609,
      room_type: 'A3',
      floor: 26,
    },
    {
      address_number: '1199/99',
      room_number: 2610,
      room_type: 'B2',
      floor: 26,
    },
    {
      address_number: '1199/100',
      room_number: 2611,
      room_type: 'C6',
      floor: 26,
    },
    {
      address_number: '1199/101',
      room_number: 2501,
      room_type: 'C3',
      floor: 25,
    },
    {
      address_number: '1199/102',
      room_number: 2502,
      room_type: 'B1',
      floor: 25,
    },
    {
      address_number: '1199/103',
      room_number: 2503,
      room_type: 'C1',
      floor: 25,
    },
    {
      address_number: '1199/104',
      room_number: 2504,
      room_type: 'C5',
      floor: 25,
    },
    {
      address_number: '1199/105',
      room_number: 2505,
      room_type: 'B3',
      floor: 25,
    },
    {
      address_number: '1199/106',
      room_number: 2506,
      room_type: 'C4',
      floor: 25,
    },
    {
      address_number: '1199/107',
      room_number: 2507,
      room_type: 'A3',
      floor: 25,
    },
    {
      address_number: '1199/108',
      room_number: 2508,
      room_type: 'A3',
      floor: 25,
    },
    {
      address_number: '1199/109',
      room_number: 2509,
      room_type: 'A3',
      floor: 25,
    },
    {
      address_number: '1199/110',
      room_number: 2510,
      room_type: 'B2',
      floor: 25,
    },
    {
      address_number: '1199/111',
      room_number: 2511,
      room_type: 'C6',
      floor: 25,
    },
    {
      address_number: '1199/112',
      room_number: 2401,
      room_type: 'C3',
      floor: 24,
    },
    {
      address_number: '1199/113',
      room_number: 2402,
      room_type: 'B1',
      floor: 24,
    },
    {
      address_number: '1199/114',
      room_number: 2403,
      room_type: 'C1',
      floor: 24,
    },
    {
      address_number: '1199/115',
      room_number: 2404,
      room_type: 'C5',
      floor: 24,
    },
    {
      address_number: '1199/116',
      room_number: 2405,
      room_type: 'B3',
      floor: 24,
    },
    {
      address_number: '1199/117',
      room_number: 2406,
      room_type: 'C4',
      floor: 24,
    },
    {
      address_number: '1199/118',
      room_number: 2407,
      room_type: 'A3',
      floor: 24,
    },
    {
      address_number: '1199/119',
      room_number: 2408,
      room_type: 'A3',
      floor: 24,
    },
    {
      address_number: '1199/120',
      room_number: 2409,
      room_type: 'A3',
      floor: 24,
    },
    {
      address_number: '1199/121',
      room_number: 2410,
      room_type: 'B2',
      floor: 24,
    },
    {
      address_number: '1199/122',
      room_number: 2411,
      room_type: 'C6',
      floor: 24,
    },
    {
      address_number: '1199/123',
      room_number: 2301,
      room_type: 'C3',
      floor: 23,
    },
    {
      address_number: '1199/124',
      room_number: 2302,
      room_type: 'B1',
      floor: 23,
    },
    {
      address_number: '1199/125',
      room_number: 2303,
      room_type: 'C1',
      floor: 23,
    },
    {
      address_number: '1199/126',
      room_number: 2304,
      room_type: 'C5',
      floor: 23,
    },
    {
      address_number: '1199/127',
      room_number: 2305,
      room_type: 'B3',
      floor: 23,
    },
    {
      address_number: '1199/128',
      room_number: 2306,
      room_type: 'C4',
      floor: 23,
    },
    {
      address_number: '1199/129',
      room_number: 2307,
      room_type: 'A3',
      floor: 23,
    },
    {
      address_number: '1199/130',
      room_number: 2308,
      room_type: 'A3',
      floor: 23,
    },
    {
      address_number: '1199/131',
      room_number: 2309,
      room_type: 'A3',
      floor: 23,
    },
    {
      address_number: '1199/132',
      room_number: 2310,
      room_type: 'B2',
      floor: 23,
    },
    {
      address_number: '1199/133',
      room_number: 2311,
      room_type: 'C6',
      floor: 23,
    },
    {
      address_number: '1199/134',
      room_number: 2201,
      room_type: 'C3',
      floor: 22,
    },
    {
      address_number: '1199/135',
      room_number: 2202,
      room_type: 'B1',
      floor: 22,
    },
    {
      address_number: '1199/136',
      room_number: 2203,
      room_type: 'C1',
      floor: 22,
    },
    {
      address_number: '1199/137',
      room_number: 2204,
      room_type: 'C5',
      floor: 22,
    },
    {
      address_number: '1199/138',
      room_number: 2205,
      room_type: 'B3',
      floor: 22,
    },
    {
      address_number: '1199/139',
      room_number: 2206,
      room_type: 'C4',
      floor: 22,
    },
    {
      address_number: '1199/140',
      room_number: 2207,
      room_type: 'A3',
      floor: 22,
    },
    {
      address_number: '1199/141',
      room_number: 2208,
      room_type: 'A3',
      floor: 22,
    },
    {
      address_number: '1199/142',
      room_number: 2209,
      room_type: 'A3',
      floor: 22,
    },
    {
      address_number: '1199/143',
      room_number: 2210,
      room_type: 'B2',
      floor: 22,
    },
    {
      address_number: '1199/144',
      room_number: 2211,
      room_type: 'C6',
      floor: 22,
    },
    {
      address_number: '1199/145',
      room_number: 2101,
      room_type: 'C3',
      floor: 21,
    },
    {
      address_number: '1199/146',
      room_number: 2102,
      room_type: 'B1',
      floor: 21,
    },
    {
      address_number: '1199/147',
      room_number: 2103,
      room_type: 'C1',
      floor: 21,
    },
    {
      address_number: '1199/148',
      room_number: 2104,
      room_type: 'C5',
      floor: 21,
    },
    {
      address_number: '1199/149',
      room_number: 2105,
      room_type: 'B3',
      floor: 21,
    },
    {
      address_number: '1199/150',
      room_number: 2106,
      room_type: 'C4',
      floor: 21,
    },
    {
      address_number: '1199/151',
      room_number: 2107,
      room_type: 'A3',
      floor: 21,
    },
    {
      address_number: '1199/152',
      room_number: 2108,
      room_type: 'A3',
      floor: 21,
    },
    {
      address_number: '1199/153',
      room_number: 2109,
      room_type: 'A3',
      floor: 21,
    },
    {
      address_number: '1199/154',
      room_number: 2110,
      room_type: 'B2',
      floor: 21,
    },
    {
      address_number: '1199/155',
      room_number: 2111,
      room_type: 'C6',
      floor: 21,
    },
    {
      address_number: '1199/156',
      room_number: 2001,
      room_type: 'C3',
      floor: 20,
    },
    {
      address_number: '1199/157',
      room_number: 2002,
      room_type: 'B1',
      floor: 20,
    },
    {
      address_number: '1199/158',
      room_number: 2003,
      room_type: 'C1',
      floor: 20,
    },
    {
      address_number: '1199/159',
      room_number: 2004,
      room_type: 'C5',
      floor: 20,
    },
    {
      address_number: '1199/160',
      room_number: 2005,
      room_type: 'B3',
      floor: 20,
    },
    {
      address_number: '1199/161',
      room_number: 2006,
      room_type: 'C4',
      floor: 20,
    },
    {
      address_number: '1199/162',
      room_number: 2007,
      room_type: 'A3',
      floor: 20,
    },
    {
      address_number: '1199/163',
      room_number: 2008,
      room_type: 'A3',
      floor: 20,
    },
    {
      address_number: '1199/164',
      room_number: 2009,
      room_type: 'A3',
      floor: 20,
    },
    {
      address_number: '1199/165',
      room_number: 2010,
      room_type: 'B2',
      floor: 20,
    },
    {
      address_number: '1199/166',
      room_number: 2011,
      room_type: 'A1',
      floor: 20,
    },
    {
      address_number: '1199/167',
      room_number: 2012,
      room_type: 'A2',
      floor: 20,
    },
    {
      address_number: '1199/168',
      room_number: 1901,
      room_type: 'C3',
      floor: 19,
    },
    {
      address_number: '1199/169',
      room_number: 1902,
      room_type: 'B1',
      floor: 19,
    },
    {
      address_number: '1199/170',
      room_number: 1903,
      room_type: 'C1',
      floor: 19,
    },
    {
      address_number: '1199/171',
      room_number: 1904,
      room_type: 'C5',
      floor: 19,
    },
    {
      address_number: '1199/172',
      room_number: 1905,
      room_type: 'B3',
      floor: 19,
    },
    {
      address_number: '1199/173',
      room_number: 1906,
      room_type: 'C4',
      floor: 19,
    },
    {
      address_number: '1199/174',
      room_number: 1907,
      room_type: 'A3',
      floor: 19,
    },
    {
      address_number: '1199/175',
      room_number: 1908,
      room_type: 'A3',
      floor: 19,
    },
    {
      address_number: '1199/176',
      room_number: 1909,
      room_type: 'A3',
      floor: 19,
    },
    {
      address_number: '1199/177',
      room_number: 1910,
      room_type: 'B2',
      floor: 19,
    },
    {
      address_number: '1199/178',
      room_number: 1911,
      room_type: 'A1',
      floor: 19,
    },
    {
      address_number: '1199/179',
      room_number: 1912,
      room_type: 'A2',
      floor: 19,
    },
    {
      address_number: '1199/180',
      room_number: 1801,
      room_type: 'C3',
      floor: 18,
    },
    {
      address_number: '1199/181',
      room_number: 1802,
      room_type: 'B1',
      floor: 18,
    },
    {
      address_number: '1199/182',
      room_number: 1803,
      room_type: 'C1',
      floor: 18,
    },
    {
      address_number: '1199/183',
      room_number: 1804,
      room_type: 'C5',
      floor: 18,
    },
    {
      address_number: '1199/184',
      room_number: 1805,
      room_type: 'B3',
      floor: 18,
    },
    {
      address_number: '1199/185',
      room_number: 1806,
      room_type: 'C4',
      floor: 18,
    },
    {
      address_number: '1199/186',
      room_number: 1807,
      room_type: 'A3',
      floor: 18,
    },
    {
      address_number: '1199/187',
      room_number: 1808,
      room_type: 'A3',
      floor: 18,
    },
    {
      address_number: '1199/188',
      room_number: 1809,
      room_type: 'A3',
      floor: 18,
    },
    {
      address_number: '1199/189',
      room_number: 1810,
      room_type: 'B2',
      floor: 18,
    },
    {
      address_number: '1199/190',
      room_number: 1811,
      room_type: 'A1',
      floor: 18,
    },
    {
      address_number: '1199/191',
      room_number: 1812,
      room_type: 'A2',
      floor: 18,
    },
    {
      address_number: '1199/192',
      room_number: 1701,
      room_type: 'C3',
      floor: 17,
    },
    {
      address_number: '1199/193',
      room_number: 1702,
      room_type: 'B1',
      floor: 17,
    },
    {
      address_number: '1199/194',
      room_number: 1703,
      room_type: 'C1',
      floor: 17,
    },
    {
      address_number: '1199/195',
      room_number: 1704,
      room_type: 'C5',
      floor: 17,
    },
    {
      address_number: '1199/196',
      room_number: 1705,
      room_type: 'B3',
      floor: 17,
    },
    {
      address_number: '1199/197',
      room_number: 1706,
      room_type: 'C4',
      floor: 17,
    },
    {
      address_number: '1199/198',
      room_number: 1707,
      room_type: 'A3',
      floor: 17,
    },
    {
      address_number: '1199/199',
      room_number: 1708,
      room_type: 'A3',
      floor: 17,
    },
    {
      address_number: '1199/200',
      room_number: 1709,
      room_type: 'A3',
      floor: 17,
    },
    {
      address_number: '1199/201',
      room_number: 1710,
      room_type: 'B2',
      floor: 17,
    },
    {
      address_number: '1199/202',
      room_number: 1711,
      room_type: 'A1',
      floor: 17,
    },
    {
      address_number: '1199/203',
      room_number: 1712,
      room_type: 'A2',
      floor: 17,
    },
    {
      address_number: '1199/204',
      room_number: 1601,
      room_type: 'C3',
      floor: 16,
    },
    {
      address_number: '1199/205',
      room_number: 1602,
      room_type: 'B1',
      floor: 16,
    },
    {
      address_number: '1199/206',
      room_number: 1603,
      room_type: 'C1',
      floor: 16,
    },
    {
      address_number: '1199/207',
      room_number: 1604,
      room_type: 'C5',
      floor: 16,
    },
    {
      address_number: '1199/208',
      room_number: 1605,
      room_type: 'B3',
      floor: 16,
    },
    {
      address_number: '1199/209',
      room_number: 1606,
      room_type: 'C4',
      floor: 16,
    },
    {
      address_number: '1199/210',
      room_number: 1607,
      room_type: 'A3',
      floor: 16,
    },
    {
      address_number: '1199/211',
      room_number: 1608,
      room_type: 'A3',
      floor: 16,
    },
    {
      address_number: '1199/212',
      room_number: 1609,
      room_type: 'A3',
      floor: 16,
    },
    {
      address_number: '1199/213',
      room_number: 1610,
      room_type: 'B2',
      floor: 16,
    },
    {
      address_number: '1199/214',
      room_number: 1611,
      room_type: 'A1',
      floor: 16,
    },
    {
      address_number: '1199/215',
      room_number: 1612,
      room_type: 'A2',
      floor: 16,
    },
    {
      address_number: '1199/216',
      room_number: 1501,
      room_type: 'C3',
      floor: 15,
    },
    {
      address_number: '1199/217',
      room_number: 1502,
      room_type: 'B1',
      floor: 15,
    },
    {
      address_number: '1199/218',
      room_number: 1503,
      room_type: 'C1',
      floor: 15,
    },
    {
      address_number: '1199/219',
      room_number: 1504,
      room_type: 'C5',
      floor: 15,
    },
    {
      address_number: '1199/220',
      room_number: 1505,
      room_type: 'B3',
      floor: 15,
    },
    {
      address_number: '1199/221',
      room_number: 1506,
      room_type: 'C4',
      floor: 15,
    },
    {
      address_number: '1199/222',
      room_number: 1507,
      room_type: 'A3',
      floor: 15,
    },
    {
      address_number: '1199/223',
      room_number: 1508,
      room_type: 'A3',
      floor: 15,
    },
    {
      address_number: '1199/224',
      room_number: 1509,
      room_type: 'A3',
      floor: 15,
    },
    {
      address_number: '1199/225',
      room_number: 1510,
      room_type: 'B2',
      floor: 15,
    },
    {
      address_number: '1199/226',
      room_number: 1511,
      room_type: 'A1',
      floor: 15,
    },
    {
      address_number: '1199/227',
      room_number: 1512,
      room_type: 'A2',
      floor: 15,
    },
    {
      address_number: '1199/228',
      room_number: 1401,
      room_type: 'C3',
      floor: 14,
    },
    {
      address_number: '1199/229',
      room_number: 1402,
      room_type: 'B1',
      floor: 14,
    },
    {
      address_number: '1199/230',
      room_number: 1403,
      room_type: 'C1',
      floor: 14,
    },
    {
      address_number: '1199/231',
      room_number: 1404,
      room_type: 'C5',
      floor: 14,
    },
    {
      address_number: '1199/232',
      room_number: 1405,
      room_type: 'B3',
      floor: 14,
    },
    {
      address_number: '1199/233',
      room_number: 1406,
      room_type: 'C4',
      floor: 14,
    },
    {
      address_number: '1199/234',
      room_number: 1407,
      room_type: 'A3',
      floor: 14,
    },
    {
      address_number: '1199/235',
      room_number: 1408,
      room_type: 'A3',
      floor: 14,
    },
    {
      address_number: '1199/236',
      room_number: 1409,
      room_type: 'A3',
      floor: 14,
    },
    {
      address_number: '1199/237',
      room_number: 1410,
      room_type: 'B2',
      floor: 14,
    },
    {
      address_number: '1199/238',
      room_number: 1411,
      room_type: 'A1',
      floor: 14,
    },
    {
      address_number: '1199/239',
      room_number: 1412,
      room_type: 'A2',
      floor: 14,
    },
    {
      address_number: '1199/240',
      room_number: 1301,
      room_type: 'C3',
      floor: 13,
    },
    {
      address_number: '1199/241',
      room_number: 1302,
      room_type: 'B1',
      floor: 13,
    },
    {
      address_number: '1199/242',
      room_number: 1303,
      room_type: 'C1',
      floor: 13,
    },
    {
      address_number: '1199/243',
      room_number: 1304,
      room_type: 'C5',
      floor: 13,
    },
    {
      address_number: '1199/244',
      room_number: 1305,
      room_type: 'B3',
      floor: 13,
    },
    {
      address_number: '1199/245',
      room_number: 1306,
      room_type: 'C4',
      floor: 13,
    },
    {
      address_number: '1199/246',
      room_number: 1307,
      room_type: 'A3',
      floor: 13,
    },
    {
      address_number: '1199/247',
      room_number: 1308,
      room_type: 'A3',
      floor: 13,
    },
    {
      address_number: '1199/248',
      room_number: 1309,
      room_type: 'A3',
      floor: 13,
    },
    {
      address_number: '1199/249',
      room_number: 1310,
      room_type: 'B2',
      floor: 13,
    },
    {
      address_number: '1199/250',
      room_number: 1311,
      room_type: 'A1',
      floor: 13,
    },
    {
      address_number: '1199/251',
      room_number: 1312,
      room_type: 'A2',
      floor: 13,
    },
    {
      address_number: '1199/252',
      room_number: 1201,
      room_type: 'C3',
      floor: 12,
    },
    {
      address_number: '1199/253',
      room_number: 1202,
      room_type: 'B1',
      floor: 12,
    },
    {
      address_number: '1199/254',
      room_number: 1203,
      room_type: 'C1',
      floor: 12,
    },
    {
      address_number: '1199/255',
      room_number: 1204,
      room_type: 'C5',
      floor: 12,
    },
    {
      address_number: '1199/256',
      room_number: 1205,
      room_type: 'B3',
      floor: 12,
    },
    {
      address_number: '1199/257',
      room_number: 1206,
      room_type: 'C4',
      floor: 12,
    },
    {
      address_number: '1199/258',
      room_number: 1207,
      room_type: 'A3',
      floor: 12,
    },
    {
      address_number: '1199/259',
      room_number: 1208,
      room_type: 'A3',
      floor: 12,
    },
    {
      address_number: '1199/260',
      room_number: 1209,
      room_type: 'A3',
      floor: 12,
    },
    {
      address_number: '1199/261',
      room_number: 1210,
      room_type: 'B2',
      floor: 12,
    },
    {
      address_number: '1199/262',
      room_number: 1211,
      room_type: 'A1',
      floor: 12,
    },
    {
      address_number: '1199/263',
      room_number: 1212,
      room_type: 'A2',
      floor: 12,
    },
    {
      address_number: '1199/264',
      room_number: 1101,
      room_type: 'C3',
      floor: 11,
    },
    {
      address_number: '1199/265',
      room_number: 1102,
      room_type: 'B1',
      floor: 11,
    },
    {
      address_number: '1199/266',
      room_number: 1103,
      room_type: 'C1',
      floor: 11,
    },
    {
      address_number: '1199/267',
      room_number: 1104,
      room_type: 'C5',
      floor: 11,
    },
    {
      address_number: '1199/268',
      room_number: 1105,
      room_type: 'B3',
      floor: 11,
    },
    {
      address_number: '1199/269',
      room_number: 1106,
      room_type: 'C4',
      floor: 11,
    },
    {
      address_number: '1199/270',
      room_number: 1107,
      room_type: 'A3',
      floor: 11,
    },
    {
      address_number: '1199/271',
      room_number: 1108,
      room_type: 'A3',
      floor: 11,
    },
    {
      address_number: '1199/272',
      room_number: 1109,
      room_type: 'A3',
      floor: 11,
    },
    {
      address_number: '1199/273',
      room_number: 1110,
      room_type: 'B2',
      floor: 11,
    },
    {
      address_number: '1199/274',
      room_number: 1111,
      room_type: 'A1',
      floor: 11,
    },
    {
      address_number: '1199/275',
      room_number: 1112,
      room_type: 'A2',
      floor: 11,
    },
    {
      address_number: '1199/276',
      room_number: 1001,
      room_type: 'C3',
      floor: 10,
    },
    {
      address_number: '1199/277',
      room_number: 1002,
      room_type: 'B1',
      floor: 10,
    },
    {
      address_number: '1199/278',
      room_number: 1003,
      room_type: 'C1',
      floor: 10,
    },
    {
      address_number: '1199/279',
      room_number: 1004,
      room_type: 'C5',
      floor: 10,
    },
    {
      address_number: '1199/280',
      room_number: 1005,
      room_type: 'B3',
      floor: 10,
    },
    {
      address_number: '1199/281',
      room_number: 1006,
      room_type: 'C4',
      floor: 10,
    },
    {
      address_number: '1199/282',
      room_number: 1007,
      room_type: 'A3',
      floor: 10,
    },
    {
      address_number: '1199/283',
      room_number: 1008,
      room_type: 'A3',
      floor: 10,
    },
    {
      address_number: '1199/284',
      room_number: 1009,
      room_type: 'A3',
      floor: 10,
    },
    {
      address_number: '1199/285',
      room_number: 1010,
      room_type: 'B2',
      floor: 10,
    },
    {
      address_number: '1199/286',
      room_number: 1011,
      room_type: 'A1',
      floor: 10,
    },
    {
      address_number: '1199/287',
      room_number: 1012,
      room_type: 'A2',
      floor: 10,
    },
    {
      address_number: '1199/288',
      room_number: 901,
      room_type: 'C3',
      floor: 9,
    },
    {
      address_number: '1199/289',
      room_number: 902,
      room_type: 'B1',
      floor: 9,
    },
    {
      address_number: '1199/290',
      room_number: 903,
      room_type: 'C1',
      floor: 9,
    },
    {
      address_number: '1199/291',
      room_number: 904,
      room_type: 'C5',
      floor: 9,
    },
    {
      address_number: '1199/292',
      room_number: 905,
      room_type: 'B3',
      floor: 9,
    },
    {
      address_number: '1199/293',
      room_number: 906,
      room_type: 'C4',
      floor: 9,
    },
    {
      address_number: '1199/294',
      room_number: 907,
      room_type: 'A3',
      floor: 9,
    },
    {
      address_number: '1199/295',
      room_number: 908,
      room_type: 'A3',
      floor: 9,
    },
    {
      address_number: '1199/296',
      room_number: 909,
      room_type: 'A3',
      floor: 9,
    },
    {
      address_number: '1199/297',
      room_number: 910,
      room_type: 'B2',
      floor: 9,
    },
    {
      address_number: '1199/298',
      room_number: 911,
      room_type: 'A1',
      floor: 9,
    },
    {
      address_number: '1199/299',
      room_number: 912,
      room_type: 'A2',
      floor: 9,
    },
    {
      address_number: '1199/300',
      room_number: 801,
      room_type: 'C3',
      floor: 8,
    },
    {
      address_number: '1199/301',
      room_number: 802,
      room_type: 'B1',
      floor: 8,
    },
    {
      address_number: '1199/302',
      room_number: 803,
      room_type: 'C1',
      floor: 8,
    },
    {
      address_number: '1199/303',
      room_number: 804,
      room_type: 'C5',
      floor: 8,
    },
    {
      address_number: '1199/304',
      room_number: 805,
      room_type: 'B3',
      floor: 8,
    },
    {
      address_number: '1199/305',
      room_number: 806,
      room_type: 'C4',
      floor: 8,
    },
    {
      address_number: '1199/306',
      room_number: 807,
      room_type: 'A3',
      floor: 8,
    },
    {
      address_number: '1199/307',
      room_number: 808,
      room_type: 'A3',
      floor: 8,
    },
    {
      address_number: '1199/308',
      room_number: 809,
      room_type: 'A3',
      floor: 8,
    },
    {
      address_number: '1199/309',
      room_number: 810,
      room_type: 'B2',
      floor: 8,
    },
    {
      address_number: '1199/310',
      room_number: 811,
      room_type: 'A1',
      floor: 8,
    },
    {
      address_number: '1199/311',
      room_number: 812,
      room_type: 'A2',
      floor: 8,
    },
  ];

  const addDataHandle = async () => {
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      let values = {
        address_number: address.address_number,
        room_number: address.room_number.toString(),
        room_type: address.room_type,
        floor: address.floor.toString(),
      };
      const { data } = await addressServices.postAddress(values);
      if (data) {
        console.log(data.address_number);
      }
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Information"
        onCancel={() => onCancel()}
        footer={null}
        width={800}
        centered
      >
        <div>
          <Button onClick={addDataHandle}>Add</Button>
        </div>
      </Modal>
    </>
  );
}

export default AddNewAddress;
