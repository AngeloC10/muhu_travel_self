import { Request, Response } from 'express';
import prisma from '../db.js';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(clients);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { fullName, docType, docNumber, email, phone } = req.body;

    if (!fullName || !docType || !docNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingClient = await prisma.client.findUnique({
      where: { docType_docNumber: { docType, docNumber } },
    });

    if (existingClient) {
      return res.status(409).json({ error: 'Client already exists' });
    }

    const client = await prisma.client.create({
      data: { fullName, docType, docNumber, email, phone },
    });

    return res.status(201).json(client);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;

    const client = await prisma.client.update({
      where: { id },
      data: { fullName, email, phone },
    });

    return res.json(client);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({ where: { id } });
    return res.json({ message: 'Client deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const upsertClient = async (req: Request, res: Response) => {
  try {
    const { fullName, docType, docNumber, email, phone } = req.body;

    if (!fullName || !docType || !docNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await prisma.client.upsert({
      where: { docType_docNumber: { docType, docNumber } },
      update: { fullName, email, phone },
      create: { fullName, docType, docNumber, email, phone },
    });

    return res.json(client);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
