import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const GallerySlider = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(tr
