import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  writeBatch,
  query,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwDdFc46NEpESb3e4VhWGI4BUQNcYbXE4",
  authDomain: "web-rental-registration.firebaseapp.com",
  projectId: "web-rental-registration",
  storageBucket: "web-rental-registration.appspot.com",
  messagingSenderId: "100660266875",
  appId: "1:100660266875:web:79805546ff506421989fde",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "collections");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const getCategoriesFromFirebase = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return categories;
  } catch (error) {
    console.error("Error retrieving categories from Firebase:", error);
    return [];
  }
};

export const pushDataToFirebase = async (collectionName, data) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef);

    const dataWithCreateDate = { ...data, createDate: serverTimestamp() };

    await setDoc(docRef, dataWithCreateDate);

    console.log("Data pushed to Firebase successfully!");
  } catch (error) {
    console.error("Error pushing data to Firebase:", error);
  }
};

export const addProductToCategory = async (categoryId, productData) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const productsCollectionRef = collection(categoryRef, "products");

    await addDoc(productsCollectionRef, productData);

    console.log("Product added to category successfully!");
  } catch (error) {
    console.error("Error adding product to category:", error);
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const productsCollectionRef = collection(categoryRef, "products");

    const querySnapshot = await getDocs(productsCollectionRef);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("Error retrieving products by categoryId:", error);
    return [];
  }
};

export const deleteProductById = async (categoryId, productId) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const productsCollectionRef = collection(categoryRef, "products");
    const productDocRef = doc(productsCollectionRef, productId);

    await deleteDoc(productDocRef);

    console.log("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const editProductById = async (categoryId, productId, updatedData) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const productsCollectionRef = collection(categoryRef, "products");
    const productDocRef = doc(productsCollectionRef, productId);

    await updateDoc(productDocRef, updatedData);

    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error editing product:", error);
  }
};

export const editProducRentStatustById = async (
  categoryId,
  productId,
  updatedData
) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const productsCollectionRef = collection(categoryRef, "products");
    const productDocRef = doc(productsCollectionRef, productId);

    await updateDoc(productDocRef, { rented: updatedData });

    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error editing product:", error);
  }
};

export const pushProductToUserCollection = async (userId, productId) => {
  try {
    const userRef = doc(db, "custommers", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const productsArray = userDoc.data().products || [];
      productsArray.push(productId);

      await updateDoc(userRef, { products: productsArray });

      console.log("Product added to user collection successfully!");
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error adding product to user collection:", error);
  }
};

export const removeProductFromUserCollection = async (userId, productId) => {
  try {
    const userRef = doc(db, "custommers", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const productsArray = userDoc.data().products || [];
      const updatedProductsArray = productsArray.filter(
        (product) => product !== productId
      );

      await updateDoc(userRef, { products: updatedProductsArray });

      console.log("Product removed from user collection successfully!");
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error removing product from user collection:", error);
  }
};

export const editOrderById = async (orderId, updatedData) => {
  try {
    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, updatedData);

    console.log("Order updated successfully!");
  } catch (error) {
    console.error("Error editing order:", error);
  }
};

export const deleteOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
    console.log("Order deleted successfully!");
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

export const editCustomerById = async (customerId, updatedData) => {
  try {
    const customerRef = doc(db, "custommers", customerId);
    await updateDoc(customerRef, updatedData);

    console.log("Customer updated successfully!");
  } catch (error) {
    console.error("Error editing customer:", error);
  }
};

export const deleteCustomerById = async (customerId) => {
  try {
    const customerRef = doc(db, "custommers", customerId);
    await deleteDoc(customerRef);

    console.log("Customer deleted successfully!");
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

export const editCategoryById = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);

    await updateDoc(categoryRef, updatedData);

    console.log("Category updated successfully!");
  } catch (error) {
    console.error("Error editing category:", error);
  }
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const calculateTotalIncome = async () => {
  try {
    const ordersCollectionRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersCollectionRef);

    let totalIncome = 0;

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const orderIncome = orderData.income;

      // Add the order income to the total
      totalIncome += orderIncome;
    });

    return totalIncome;
  } catch (error) {
    console.error("Error calculating total income:", error);
    return 0;
  }
};

export const calculateTotalExpectedIncome = async () => {
  try {
    const ordersCollectionRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersCollectionRef);

    let totalIncome = 0;

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const orderIncome = orderData.expectedIncome;

      // Add the order income to the total
      totalIncome += orderIncome;
    });

    return totalIncome;
  } catch (error) {
    console.error("Error calculating total income:", error);
    return 0;
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
