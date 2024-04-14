import React, { useState } from "react";
import {doc,
    setDoc,
    serverTimestamp,
    getFirestore,
} from "firebase/firestore";
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
import {uuidv4} from "@firebase/util";
import {Category} from "@/components/types/types";

export function AddCategory() {
    const { user } = UserAuth();
    const [dialogVisible, setDialogVisible] = useState(true);
    const [newCategory, setNewCategory] = useState<Category>({
        id: uuidv4(),
        userId: user.uid,
        name: "",
        creationDate: new Date(),
        items: [],
    });

    const handleButtonClick = async () => {
        await addCategory();
        setDialogVisible(false);
    };
    const addCategory = async () => {
        if (newCategory.name !== "") {
            const firestore = getFirestore();

            try {
                const categoryDocRef = doc(
                    firestore,
                    `categories/${newCategory.id}`
                );

                await setDoc(categoryDocRef, {
                    ...newCategory,
                    creationDate: serverTimestamp(),
                    updateDate: serverTimestamp(),
                });

                setNewCategory({
                    id: uuidv4(),
                    userId: user.uid,
                    name: "",
                    creationDate: new Date(),
                    items: [],
                });
            } catch (error) {
                console.error("Error adding space document: ", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await addCategory();
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-26 mt-2">Add Category</Button>
                </DialogTrigger>
                {dialogVisible && (
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                            <DialogDescription>
                                A Category is a way to group items.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <Label>
                                Name:
                                <Input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, name: e.target.value })
                                    }
                                />
                            </Label>
                            <Label>
                                Description:
                                <Input
                                    type="text"
                                    name="Description"
                                    value={newCategory.description}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, description: e.target.value })
                                    }
                                />
                            </Label>

                            <DialogFooter>
                                <Button className="m-2" type="submit" onClick={handleButtonClick}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                )}
            </Dialog>

        </div>
    );
}
