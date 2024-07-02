"use client";

import React, { type SyntheticEvent } from "react";

import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";

import "react-image-crop/dist/ReactCrop.css";
import { CropIcon, Trash2Icon } from "lucide-react";

interface ImageCropperProps {
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    value: string;
    setValue: (value: string) => void;
    aspect?: number;
}

export function ImageCropper({ dialogOpen, setDialogOpen, value, setValue, aspect = 1 }: ImageCropperProps) {
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    const [crop, setCrop] = React.useState<Crop>();
    const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
    const [croppedImage, setCroppedImage] = React.useState<string>("");

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }

    function onCropComplete(crop: PixelCrop) {
        if (imgRef.current && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, crop);
            setCroppedImageUrl(croppedImageUrl);
        }
    }

    function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );
        }

        return canvas.toDataURL("image/png", 1.0);
    }

    async function onCrop() {
        try {
            setCroppedImage(croppedImageUrl);
            setValue(croppedImageUrl);
            setDialogOpen(false);
        } catch (error) {
            alert("Something went wrong!");
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="p-0 gap-0">
                <div className="p-6 size-full">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => onCropComplete(c)}
                        aspect={aspect}
                        className="w-full"
                    >
                        <img ref={imgRef} src={value} alt="Image Cropper Shell" onLoad={onImageLoad} />
                    </ReactCrop>
                </div>
                <DialogFooter className="p-6 pt-0 justify-center ">
                    <DialogClose asChild>
                        <Button
                            size={"sm"}
                            type="reset"
                            className="w-fit"
                            variant={"outline"}
                            onClick={() => {
                                setValue("");
                            }}
                        >
                            <Trash2Icon className="mr-1.5 size-4" />
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button size={"sm"} className="w-fit" onClick={onCrop}>
                        <CropIcon className="mr-1.5 size-4" />
                        Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 50,
                height: 50,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}
