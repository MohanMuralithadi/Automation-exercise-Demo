import { expect, test } from '@playwright/test';
import { AccountPage } from './pages/AccountPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { PaymentPage } from './pages/PaymentPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductsPage } from './pages/ProductsPage';
import { SignupLoginPage } from './pages/SignupLoginPage';
import { createPaymentDetails, createRegisterUser } from './utils/testData';

test.describe('Automation Exercise ecommerce journey', () => {
  test('register, login, buy a product, verify order, and delete account', async ({ page }) => {
    test.setTimeout(180000);

    const homePage = new HomePage(page);
    const signupLoginPage = new SignupLoginPage(page);
    const accountPage = new AccountPage(page);
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    const user = createRegisterUser();
    const paymentDetails = createPaymentDetails(user);
    const productSearchTerm = 'Tshirt';
    const productQuantity = 1;

    // Step 1: Navigate to the Automation Exercise demo ecommerce website.
    await homePage.goto();
    await homePage.verifyHomePageIsOpen();

    // Step 2: Register a new user with a dynamically generated email address.
    await homePage.openSignupLogin();
    await signupLoginPage.verifySignupLoginPageIsOpen();
    await signupLoginPage.submitNewUserSignup(user.name, user.email);
    await accountPage.createAccount(user);
    await accountPage.verifyAccountCreatedAndContinue();
    await homePage.verifyLoggedInAs(user.name);

    // Step 3: Login validation is covered by the newly created active session.
    // Then log out/in through the Signup/Login page to verify created credentials.
    await page.getByRole('link', { name: /logout/i }).click();
    await signupLoginPage.verifySignupLoginPageIsOpen();
    await signupLoginPage.login(user.email, user.password);
    await homePage.verifyLoggedInAs(user.name);

    // Step 4: Search for a product from the Products page.
    await homePage.openProducts();
    await productsPage.verifyProductsPageIsOpen();
    await productsPage.searchProduct(productSearchTerm);

    // Step 5: Open the first product returned from search results.
    const selectedProduct = await productsPage.openFirstProductFromResults();
    await productDetailsPage.verifyProductDetails(selectedProduct);

    // Step 6: Add the product to the cart.
    await productDetailsPage.addProductToCart(productQuantity);
    await productDetailsPage.openCartFromModal();

    // Step 7: Validate product name, price, and quantity in the cart.
    await cartPage.verifyCartPageIsOpen();
    await cartPage.verifyProductInCart(selectedProduct, productQuantity);

    // Step 8: Proceed to checkout.
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutPageIsOpen();

    // Step 9: Validate shipping details, review the product, and place the order.
    await checkoutPage.verifyShippingDetails(user);
    await checkoutPage.verifyOrderReview(selectedProduct, productQuantity);
    await checkoutPage.placeOrder('Please deliver during business hours.');
    await paymentPage.verifyPaymentPageIsOpen();
    await paymentPage.submitPayment(paymentDetails);

    // Step 10: Verify order confirmation and capture order ID if the application displays one.
    const orderId = await paymentPage.verifyOrderConfirmationAndCaptureOrderId();
    test.info().annotations.push({ type: 'order-id', description: orderId });
    expect(orderId.length).toBeGreaterThan(0);

    // Step 12: Delete the account, continue, and verify the user returns to home page.
    await homePage.deleteAccount();
    await accountPage.verifyAccountDeletedAndContinue();
    await homePage.verifyHomePageIsOpen();
  });
});
