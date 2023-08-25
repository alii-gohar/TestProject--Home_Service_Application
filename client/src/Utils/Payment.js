import { loadStripe } from "@stripe/stripe-js";
import axiosCall from "./AxiosCall";

const makePayment = async (id) => {
  const stripe = await loadStripe(
    "pk_test_51NhT0ECUdPFxlntK8QGZ7lzweTJJfCNTYT2VTmP7t2UDm78v1PKipO4oEKn3imCika0E4TiUG9dPncXJhITmPnjc00f8WBVzM5"
  );
  const response = await axiosCall("POST", "customer/makePayment", { id: id });
  console.log(response);
  if (response.status === 200) {
    const result = await stripe.redirectToCheckout({
      sessionId: response.data.sessionId,
    });
    console.log(result);
    return true;
  }
};
export default makePayment;
