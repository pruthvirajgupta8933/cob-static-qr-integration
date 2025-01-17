export const clearLocalStore = () => {
  localStorage.removeItem("subscriptionplan");
  localStorage.removeItem("subscriptionchargesdetail");
  localStorage.removeItem("at");
  localStorage.removeItem("rt");
  localStorage.removeItem("categoryId");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.removeItem("ap");
  localStorage.removeItem("mid");
  localStorage.removeItem("onboardingStatusByAdmin");
  localStorage.removeItem("expiredTime");
  localStorage.removeItem("onboardingStatusByReferrer");
  sessionStorage.removeItem("paymentLinkApiKey")
};
