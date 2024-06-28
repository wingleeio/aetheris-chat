import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type ImageUploadInputProps<T extends Function = any> = {
    name: string;
    className?: string;
    defaultValue?: string;
    setImageValue: T extends (name: string, image: string, options?: any) => void
        ? T
        : (name: string, image: string) => void;
    children: React.ReactNode;
};

export const ImageUploadInput = (props: ImageUploadInputProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                props.setImageValue(props.name, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (props.defaultValue) {
            setPreview(props.defaultValue);
        }
    }, [props.defaultValue]);

    return (
        <div
            className={cn(props.className, "cursor-pointer group transition-all overflow-hidden")}
            style={{
                backgroundImage: preview ? `url(${preview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            onClick={() => inputRef!.current!.click()}
        >
            <div className="flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-full w-full bg-black/20 text-white text-sm">
                {props.children}
            </div>
            <input
                name={props.name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
                ref={inputRef}
            />
        </div>
    );
};
