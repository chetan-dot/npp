import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ContextFun from "@/context/contextFun";
import cron from "node-cron";
import connectMongo from "@/db/db";
import mongoose from "mongoose";
import garbage_history from "@/models/garbage_history";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nagarnigam Project",
  description: "Demo nagarnigam project",
};

export async function runSudeler() {
  connectMongo();
  console.log("runing sudeler");
  try {
    cron.schedule("0 0 * * *", async () => {
      function createHistory() {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              process.env.NEXT_PUBLIC_HTTP_SERVICE + "/user/wards"
            );

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const hh = await response.json();

            const pylod = {
              historyData: JSON.stringify(hh),
            };

            await garbage_history.create(pylod);

            resolve(true);
          } catch (error) {
            console.error(error);
            reject(false);
          }
        });
      }
      await createHistory();
      // cron.schedule('* * * * *', async () => {
      const fetch_data = await mongoose.connection.db.collection(
        "user_details"
      );
      let result1 = await fetch_data.updateMany(
        {},
        {
          $set: {
            Garbage_Collected: false,
          },
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
}
runSudeler();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Seal_of_Uttar_Pradesh.svg" />
      </head>
      <body className={inter.className}>
        <ContextFun>
          <ToastContainer />
          <Navbar />
          <div className="">{children}</div>
          <Footer />
        </ContextFun>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"
          async
        />

        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
      </body>
    </html>
  );
}
