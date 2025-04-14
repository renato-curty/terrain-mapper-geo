
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onChange: (image: File | string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Create URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFilename(file.name);
    onChange(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast({
        title: "URL Required",
        description: "Please enter an image URL",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(imageUrl);
      setPreviewUrl(imageUrl);
      onChange(imageUrl);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPreviewUrl(null);
    onChange(null);
    if (value === 'upload') setImageUrl('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setFilename(file.name);
        onChange(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <Tabs defaultValue="upload" onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="w-1/2">Upload Image</TabsTrigger>
          <TabsTrigger value="url" className="w-1/2">Image URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div 
            className="mt-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-10 w-10 text-terrain-brown/60" />
              <p className="text-sm">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, GIF, TIFF
              </p>
              {filename && <p className="text-xs font-medium">{filename}</p>}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="url">
          <div className="mt-2 space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleUrlSubmit}
                className="bg-terrain-brown hover:bg-terrain-brown/90"
              >
                <Link className="h-4 w-4 mr-2" />
                Load
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Image Preview:</p>
          <Card className="overflow-hidden">
            <div className="aspect-video relative bg-black/10">
              <img
                src={previewUrl}
                alt="Terrain Preview"
                className="object-contain w-full h-full"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
