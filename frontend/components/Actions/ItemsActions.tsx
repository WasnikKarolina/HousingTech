import { doc, getDocs, updateDoc, collection, getFirestore } from 'firebase/firestore';
import { Item } from "@/components/types/types";

export const fetchItems = async () => {
    const firestore = getFirestore();
    const itemsCollection = collection(firestore, "items");

    try {
        const querySnapshot = await getDocs(itemsCollection);
        const itemsData: Item[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data() as Item;
            itemsData.push({ ...data, id: doc.id });
        });

        return itemsData;
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
};

export const disableItem = async (id: string) => {
    const itemDoc = doc(getFirestore(), "items", id);

    try {
        await updateDoc(itemDoc, {
            isActive: false
        });
    } catch (error) {
        console.error("Error deactivating item:", error);
    }
};

export const enableItem = async (id: string) => {
    const itemDoc = doc(getFirestore(), "items", id);

    try {
        await updateDoc(itemDoc, {
            isActive: true
        });
    } catch (error) {
        console.error("Error activating item:", error);
    }
};
