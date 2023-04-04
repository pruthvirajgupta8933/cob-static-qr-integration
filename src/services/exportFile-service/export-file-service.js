import { axiosInstance } from "../../utilities/axiosInstance";

const exportFileDownload = () => {
  const data = {
    start_date: "2022-07-18 00:00:00",
    end_date: "2023-07-18 23:59:59",
    mode: "all",
    merchant_id: 71,
    trans_status: "all",
  };
  const URL =
    "https://staging-payout.sabpaisa.in/api/downloadTransactionHistory/";
  return axiosInstance
    .post(URL, data, {
      headers: {
        "auth-token": "B6oXD7U738vpl2T49RPbuQ==",
      },
    })
    .then((response) => {
      return response.data;
    });
};

export const ExportFileservice = {
  exportFileDownload,
};
