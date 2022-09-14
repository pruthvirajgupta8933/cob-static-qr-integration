import DailyEnquiry from '../Components/DailyEnquiry'
import GetAnswer from '../Components/GetAnswer'
import TransactionEnq from '../Components/TransactionEnq';
import SetOfQuestion from '../Components/SetOfQuestion'
import TempQuestion from '../Components/TempQuestion';
export const steps = [
  {
    id: '1',
    message: "Hello! I'm Mansha, here to answer your queries",
    trigger: '4',
  },
  {
    id: '2',
    message: 'Please fill the basic details to inititate the chat',
    trigger: '3'
  },
  {
    id: '3',
    component: <DailyEnquiry />,
  },
  {
    id: '4',
    message: "How may I help you today?",
    trigger: '5',
  },
  {
    id: '5',
    user: true,
    trigger: '6',
  },
  {
    id: '6',
    message: "Select question from the list.",
    trigger: '7',
  },
  {
    id: '7',
    component: <SetOfQuestion />,
    // end: true
  },
  {
    id: '8',
    component: <GetAnswer />, 
    asMessage: true,
  },

  {
    id: '25',
    message: "Are you satisfied with Answer",
    trigger: '26',
    // end: true
  },
  {
    id: '26',
    options: [
      { value: "Yes", label: 'Yes', trigger: '9' },
      { value: "No", label: 'No', trigger: '15' },
    ]
  },
  {
    id: '15',
    message: "Try to write another word or phrase",
    trigger: '5',
  },
  {
    id: '9',
    message: "Have another Question",
    trigger: '10'
    
  },
  {
    id: '10',
    options: [
      { value: "Yes", label: 'Yes', trigger: '4' },
      { value: "No", label: 'No', trigger: '11' },
    ]
  },
  {
    id: '11',
    message: 'Thank you',
    end: true
  },
  {
    id: '12',
    message: 'Enter Transaction Id',
    trigger: '13',
  },
  {
    id: '13',
    user: true,
    trigger: '14',
  },
  {
    id: '14',
    component: <TransactionEnq />,
    waitAction: true,
    trigger: '25',
  },
  {
    id: '15',
    component: <TempQuestion />,
    waitAction: true,
    trigger: '16',
  },
  {
    id: '16',
    message: 'Thanks for submitting the query, our exxecutive will get in touch with you soon!',
    trigger: '9',
  },
  {
    id: '500',
    message: 'We are facing some technical issue',
    end: true
  }
]