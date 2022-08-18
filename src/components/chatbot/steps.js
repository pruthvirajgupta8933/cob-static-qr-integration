import TransactionEnq from "./TransactionEnq";

export const steps =  [
    {
      id: '1',
      message: 'Hello, Welcome to the support',
      trigger: '2',
    },
    {
        id: '2',
        message: 'What is your client code?',
        trigger: '3',
      },
    {
      id: '3',
      user: true,
      trigger: '4'
    },
    {
      id: '4',
      message: 'What is your transaction id ?',
      trigger: '5',
    },
    {
      id: '5',
      user: true,
      trigger: '6'
    },
    {
      id: '6',
      message: 'I`m looking the status of the transaction id...',
      trigger: 'end-message',
    },
    {
      id: 'end-message',
      component: <TransactionEnq />,
      asMessage: true,
      end: true,
    },
  ];