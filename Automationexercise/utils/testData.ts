export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
};

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export function createRegisterUser(): RegisterUser {
  const uniqueId = Date.now();

  return {
    name: `Auto User ${uniqueId}`,
    email: `auto.user.${uniqueId}@example.com`,
    password: `Password@${uniqueId}`,
    firstName: 'Auto',
    lastName: `User${uniqueId}`,
    company: 'Automation QA',
    address1: '123 Test Street',
    address2: 'Suite 456',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobileNumber: `900${String(uniqueId).slice(-7)}`,
    birthDay: '10',
    birthMonth: 'May',
    birthYear: '1995',
  };
}

export function createPaymentDetails(user: RegisterUser): PaymentDetails {
  return {
    nameOnCard: `${user.firstName} ${user.lastName}`,
    cardNumber: '45745253788577835',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2030',
  };
}
