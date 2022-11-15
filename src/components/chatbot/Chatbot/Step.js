// import DailyEnquiry from '../Components/DailyEnquiry'
// import GetAnswer from '../Components/GetAnswer'
// import TransactionEnq from '../Components/TransactionEnq';
// import SetOfQuestion from '../Components/SetOfQuestion'
// import TempQuestion from '../Components/TempQuestion';
import MainParentComponent from '../Components/MainParentComponent';
import ParentComponent from '../Components/ParentComponent';
import SubparentComponent  from './../Components/SubparentComponent';
import ResponseComponent from '../Components/ResponseComponent';
const Id = localStorage.getItem('categoryId')
const returnIntialStep = ()=>{
  if(Id=='1'){
    return({
      id: '2',
      options: [
        { value: '1', label: "I have bussiness account with sabpaisa", trigger: '3' },
        { value: '2', label: "I don`t have bussiness acccount with Sabpaisa", trigger: '3' },
        { value: '7', label: "My Question is not listed", trigger: '3'}
      ]
    })
  }
  else{
    return({
      id: '2',
      options: [
        { value: '7', label: "Technical Related", trigger: '3' },
        { value: '7', label: "My Question is not listed", trigger: '3'}     
      ]
    })
  }
}
export const steps = [
  {
      id: '1',
      message: "Want to chat about SabPaisa's software & services? If you have a question, don't be shy.",
      trigger: '2',
  },
  // {
  //   id: '2',
  //   options: [
  //     { value: '1', label: "I have bussiness account with sabpaisa", trigger: '3' },
  //     { value: '2', label: "I don`t have bussiness acccount with Sabpaisa", trigger: '3' },
  //     { value: null, label: "My Question is not listed", trigger: '3'}
  //   ]
  // },
  returnIntialStep(),
  {
    id: '3',
    component: <MainParentComponent/>,
    // asMessage: true,
    // waitAction: true
  },
  {
    id:'4',
    component: <ParentComponent/>,
    waitAction: true
  },
  {
    id:'5',
    component: <SubparentComponent/>
  },
  {
    id: '6',
    component: <ResponseComponent />,
    asMessage: true,
    trigger: '7'
  },
  {
    id: '7',
    message: "Do you have another question?",
    trigger: '8'
  },
  {
    id: '8',
    options: [
          { value: "Yes", label: 'Yes', trigger: '2' },
          { value: "No", label: 'No', trigger: '9' },
        ]
  },
  {
    id: '9',
    message: "Thank you",
    end: true
  },
  {
    id: '500',
    message: 'We are facing some technical issue',
    end: true
  }
  // {
  //   id: '3',
  //   message: "Try to write word or phrase",
  //   trigger: '4',
  // },
  // {
  //   id: '4',
  //   user: true,
  //   trigger: '5',
  // },
  // {
  //   id: '5',
  //   message: "Select question from the list.",
  //   trigger: '6',
  // },
  // {
  //   id: '6',
  //   component: <SetOfQuestion />,
  // },
  // {
  //   id: '7',
  //   component: <SetOfQuestion />,
  // },
  // {
  //   id : '8',
  //   message: "demo route",
  //   end:true
  // }
]
// export const steps = [

  // {
  //   id: '1',
  //   message: "Want to chat about SabPaisa's software & services? If you have a question, don't be shy.",
  //   // message: "Hello! I'm Mansha, here to answer your queries",
  //   trigger: '52',
  // },
  // {
  //   id: '2',
  //   message: 'Please fill the basic details to inititate the chat',
  //   trigger: '3'
  // },
  // {
  //   id: '3',
  //   component: <DailyEnquiry />,
  // },
  // {
  //   id: '4',
  //   message: "How may I help you today?",
  //   trigger: '5',
  // },
  // {
  //   id: '5',
  //   user: true,
  //   trigger: '6',
  // },
  // {
  //   id: '6',
  //   message: "Select question from the list.",
  //   trigger: '7',
  // },
  // {
  //   id: '7',
  //   component: <SetOfQuestion />,
  //   // end: true
  // },
  // {
  //   id: '8',
  //   component: <GetAnswer />, 
  //   asMessage: true,
  // },

  // {
  //   id: '25',
  //   message: "Are you satisfied with Answer",
  //   trigger: '26',
  //   // end: true
  // },
  // {
  //   id: '26',
  //   options: [
  //     { value: "Yes", label: 'Yes', trigger: '9' },
  //     { value: "No", label: 'No', trigger: '15' },
  //   ]
  // },
  // {
  //   id: '15',
  //   message: "Try to write another word or phrase",
  //   trigger: '5',
  // },
  // {
  //   id: '9',
  //   message: "Have another Question",
  //   trigger: '10'
    
  // },
  // {
  //   id: '10',
  //   options: [
  //     { value: "Yes", label: 'Yes', trigger: '4' },
  //     { value: "No", label: 'No', trigger: '11' },
  //   ]
  // },
  // {
  //   id: '11',
  //   message: 'Thank you',
  //   end: true
  // },
  // {
  //   id: '12',
  //   message: 'Enter Transaction Id',
  //   trigger: '13',
  // },
  // {
  //   id: '13',
  //   user: true,
  //   trigger: '14',
  // },
  // {
  //   id: '14',
  //   component: <TransactionEnq />,
  //   waitAction: true,
  //   trigger: '25',
  // },
  // {
  //   id: '15',
  //   component: <TempQuestion />,
  //   waitAction: true,
  //   trigger: '16',
  // },
  // {
  //   id: '16',
  //   message: 'Thanks for submitting the query, our exxecutive will get in touch with you soon!',
  //   trigger: '9',
  // },
  // {
  //   id: '500',
  //   message: 'We are facing some technical issue',
  //   end: true
  // },
  // // {
  // //   id: 'md1',
  // //   message: "Want to chat about SabPaisa's software & services? If you have a question, don't be shy.",
  // //   trigger: 'md2',
  // // },
  // {
  //   id: '52',
  //   message: "Can you tell me exactly what you're looking for?",
  //   trigger: '53'
  //   // end: true
  // },
  // {
  //   id: '53',
  //   options: [
  //     { value: "Info about products I'm not yet using", label: "Info about products I'm not yet using", trigger: '54' },
  //     { value: "Help with products I'm already using", label: "Help with products I'm already using", trigger: '58' },
  //     { value: "Any other question", label: 'Any other question', trigger: '62' }
  //   ]
  // },
  // {
  //   id: '54',
  //   message: "Which product?",
  //   trigger: '55',
  //   // end: true
  // },
  // {
  //   id: '55',
  //   options: [
  //     { value: "Payout", label: 'Payout', trigger: '56' },
  //     { value: "Subscription Paisa", label: 'Subscription Paisa', trigger: '56' },
  //     { value: "Payment Gateway", label: 'Payment Gateway', trigger: '56' },
  //     { value: "Payment Link", label: 'Payment Link', trigger: '56' },
  //     { value: "QwikForm", label: 'QwikForm', trigger: '56' },
  //   ]
  // },
  // {
  //   id: '56',
  //   message: "SabPaisa is the World's 1st API Driven Unified Payment Experience Platform having the Best Payment Gateway in India. Collect, transfer & refund your payments online & offline. Get the best success rates with maximum payment modes available including Debit cards, Credit Card, Wallets, UPI, Bharat QR, etc.",
  //   trigger: '57',
  // },
  // {
  //   id: '57',
  //   message: "Any Other Query",
  //   trigger: '53',
  // },
  // {
  //   id: '58',
  //   message: "Which Product?",
  //   trigger: '59',
  // },
  // {
  //   id: '59',
  //   options: [
  //     { value: "Payout", label: 'Payout', trigger: '60' },
  //     { value: "Subscription Paisa", label: 'Subscription Paisa', trigger: '60' },
  //     { value: "Payment Gateway", label: 'Payment Gateway', trigger: '60' },
  //     { value: "Payment Link", label: 'Payment Link', trigger: '60' },
  //     { value: "QwikForm", label: 'QwikForm', trigger: '60' },
  //   ]
  // },
  // {
  //   id: '60',
  //   message: "You have query related to ",
  //   trigger: '61',
  // },
  // {
  //   id: '61',
  //   options: [
  //     { value: "Product Integration", label: 'Product Integration', trigger: '62' },
  //     { value: "Settlements", label: 'Settlements', trigger: '62' },
  //     { value: "Refunds", label: 'Refunds', trigger: '62' },
  //     { value: "Enquiry about transactions", label: 'Enquiry about transactions', trigger: '62' },
  //     { value: "Chargeback", label: 'Chargeback', trigger: '62' },
  //     { value: "any other help", label: 'any other help', trigger: '62' },
  //   ]
  // },
  // {
  //   id: '62',
  //   message: "Please write you query",
  //   trigger: '63',
  // },
  // {
  //   id: '63',
  //   component: <TempQuestion />,
  //   waitAction: true,
  //   // trigger: '64',
  // },

  // {
  //   id: '64',
  //   message: "We logged this and give them a message that thank you so much for your time. We will get back to you very soon on your query.",
  //   // trigger: 'md7',
  //   end: true
  // } 
// ]
// export const steps = [

// ]
