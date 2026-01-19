import { collection, query, where, getDocs } from "firebase/firestore";

const usersRef = collection(db, "users");
const q = query(usersRef, where("email", "==", "admin@motoshop.com"));
const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc) => {
  console.log(doc.id, "=>", doc.data());
});
