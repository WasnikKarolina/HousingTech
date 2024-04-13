import {
    getFirestore,

    doc, setDoc, serverTimestamp, collection, getDocs,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAuth } from "@/context/AuthContext";
import { uuidv4 } from "@firebase/util";
import {message} from "antd";
import {Select} from "@/components/ui/select";
import {Category, Item, Bid} from "@/components/types/types";


export function AddItem() {
    const [dialogVisible, setDialogVisible] = useState(true);
    const { user } = UserAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [newItem, setNewItem] = useState<Item>({
        id: uuidv4(),
        userId: user.uid,
        creationDate: new Date(),
        name: "",
        nameLowercased: "",
        quantity: 0,
        startDate: new Date(),
        endDate: "",
        startingPrice: 0,
        currentPrice: 0,
        isActive: true,
        category: "",
        condition: "",
        shippingMethod: "",
        shippingCost: 0,
        estimatedDeliveryTime: "",
        images: [],
        description: "",
        status: "active",
        bids: [],
    });
    useEffect(() => {
    const fetchCategories = async () => {
        const categoriesCollection = collection(getFirestore(), "categories");

        try {
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesData: Category[] = [];

            categoriesSnapshot.forEach((doc) => {
                const data = doc.data() as Category;
                categoriesData.push({ ...data, id: doc.id });
            });

            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
        fetchCategories();
    }, [user.uid]);

    const addItem = async () => {
        if (newItem.name !== "") {
            const firestore = getFirestore();

            try {
                const itemDocRef = doc(
                    firestore,
                    `items/${newItem.id}`
                );

                await setDoc(itemDocRef, {
                    ...newItem,
                    creationDate: serverTimestamp(),
                });

                setNewItem({
                    id: uuidv4(),
                    userId: user.uid,
                    creationDate: new Date(),
                    name: "",
                    nameLowercased: "",
                    quantity: 0,
                    startDate: new Date(),
                    endDate: "",
                    startingPrice: 0,
                    currentPrice: 0,
                    category: "",
                    isActive: true,
                    condition: "",
                    shippingMethod: "",
                    shippingCost: 0,
                    estimatedDeliveryTime: "",
                    images: [],
                    description: "",
                    status: "active",
                    bids: [],
                });
                setShowConfirmation(true);
                window.location.reload();
            } catch (error) {
                console.error("Error adding items document: ", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await addItem();
    };

    const handleButtonClick = async () => {
        await addItem();
        setDialogVisible(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setNewItem({
            ...newItem,
            name: newName,
            nameLowercased: newName.toLowerCase(),
        });
    };
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setNewItem({
            ...newItem,
            endDate: newEndDate,
        });
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        setNewItem({
            ...newItem,
            quantity: newQuantity,
        });
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = new Date(e.target.value);
        setNewItem({
            ...newItem,
            startDate: newStartDate,
        });
    };



    const handleStartingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartingPrice = parseFloat(e.target.value);
        setNewItem({
            ...newItem,
            startingPrice: newStartingPrice,
        });
    };


    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };


    const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCondition = e.target.value;
        setNewItem({
            ...newItem,
            condition: newCondition,
        });
    };


    const handleShippingMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newShippingMethod = e.target.value;
        setNewItem({
            ...newItem,
            shippingMethod: newShippingMethod,
        });
    };

    const handleShippingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newShippingCost = parseFloat(e.target.value);
        setNewItem({
            ...newItem,
            shippingCost: newShippingCost,
        });
    };

    const handleEstimatedDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEstimatedDeliveryTime = e.target.value;
        setNewItem({
            ...newItem,
            estimatedDeliveryTime: newEstimatedDeliveryTime,
        });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;
        setNewItem({
            ...newItem,
            description: newDescription,
        });
    };



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-26 mt-2">Add items</Button>
            </DialogTrigger>
            {dialogVisible && (
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Add items</DialogTitle>
                        <DialogDescription>
                            Add items to your inventory
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <Label>
                            Name:
                            <Input
                                type="text"
                                name="name"
                                value={newItem.name}
                                onChange={handleNameChange}
                            />
                        </Label>
                        <Label>
                            Description:
                            <Input
                                type="text"
                                name="description"
                                value={newItem.description}
                                onChange={handleDescriptionChange}
                            />
                        </Label>
                        <Label>
                            Quantity:
                            <Input
                                type="number"
                                name="quantity"
                                value={newItem.quantity}
                                onChange={handleQuantityChange}
                            />
                        </Label>

                        <Label>
                            Start Date:
                            <Input
                                type="date"
                                name="startDate"
                                value={newItem.startDate.toISOString().split('T')[0]}
                                onChange={handleStartDateChange}
                            />
                        </Label>

                        <Label>
                            Enddate:
                            <Input
                                type="text"
                                name="endDate"
                                value={newItem.endDate}
                                onChange={handleEndDateChange}
                            />
                        </Label>

                        <Label>
                            Starting Price:
                            <Input
                                type="number"
                                name="startingPrice"
                                value={newItem.startingPrice}
                                onChange={handleStartingPriceChange}
                            />
                        </Label>

                        <Label>
                            Category:
                            {categories.length > 0 ? (
                                <div>
                                    <select
                                        value={selectedCategory || ""}
                                        onChange={handleCategoryChange}
                                        className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <Select disabled> <br/> No categories available <br/></Select>
                            )}
                        </Label>
                        <Label>
                            Condition:
                            <Input
                                type="text"
                                name="condition"
                                value={newItem.condition}
                                onChange={handleConditionChange}
                            />
                        </Label>

                        <Label>
                            Shipping Method:
                            <Input
                                type="text"
                                name="shippingMethod"
                                value={newItem.shippingMethod}
                                onChange={handleShippingMethodChange}
                            />
                        </Label>

                        <Label>
                            Shipping Cost:
                            <Input
                                type="number"
                                name="shippingCost"
                                value={newItem.shippingCost}
                                onChange={handleShippingCostChange}
                            />
                        </Label>

                        <Label>
                            Estimated Delivery Time:
                            <Input
                                type="text"
                                name="estimatedDeliveryTime"
                                value={newItem.estimatedDeliveryTime}
                                onChange={handleEstimatedDeliveryTimeChange}
                            />
                        </Label>



                        <DialogFooter>
                            <Button className="m-2" onClick={handleButtonClick}>
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            )}
        </Dialog>
    );
}
