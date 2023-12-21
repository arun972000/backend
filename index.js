import express, { json } from 'express';

import Stripe from 'stripe';
import cors from "cors"

const app = express();


app.use(
    cors({
      origin: "*"
    })
  );
  

app.use(json())

const stripe = new Stripe('sk_test_51OM62mSFK9aYcAmKmaBHwasmsEG8orRkMHvSlnlXA00xu1EkMwyVoVwiPLHiuACbrcPB7IAReftU1mqzXGp8q8i400UJUAHRX9');
 


const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.json({ status: true, message: "Our node.js app works" })
});


app.post("/create-checkout-session",async(req,res)=>{
    const {products}=req.body
    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.title,
                images:[product.images[0]]
            },
            unit_amount:product.price * 100 * 80,
        },
        quantity:1
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:5173/sucess",
        cancel_url:"http://localhost:5173/cancel",
    });

    res.json({id:session.id})
})
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));