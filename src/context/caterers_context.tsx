"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import axiosClient from "@/util/axios";

interface CatererContextType {
  caterers: any[];
  caterer: any;

  loading: boolean;

  getAllCaterers: () => Promise<void>;

  getCatererById: (id: string) => Promise<void>;

  createCaterer: (data: any) => Promise<any>;
}

const CatererContext = createContext<CatererContextType | null>(null);

export const CatererProvider = ({ children }: { children: ReactNode }) => {
  const [caterers, setCaterers] = useState<any[]>([]);
  const [caterer, setCaterer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get All Caterers
  const getAllCaterers = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/api/caterers");

      setCaterers(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Caterer By Id
  const getCatererById = async (id: string) => {
    try {
      setLoading(true);

      const response = await axiosClient.get(`/api/caterers/${id}`);

      setCaterer(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Create Caterer
  const createCaterer = async (data: any) => {
    try {
      setLoading(true);

      const response = await axiosClient.post("/api/create-caterers", data);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatererContext.Provider
      value={{
        caterers,
        caterer,

        loading,

        getAllCaterers,
        getCatererById,
        createCaterer,
      }}
    >
      {children}
    </CatererContext.Provider>
  );
};

export const useCatererContext = () => {
  const context = useContext(CatererContext);

  if (!context) {
    throw new Error("useCatererContext must be used inside CatererProvider");
  }

  return context;
};
