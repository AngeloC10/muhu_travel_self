import { Request, Response } from 'express';
import prisma from '../db.js';

export const getProviders = async (req: Request, res: Response) => {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(providers);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProvider = async (req: Request, res: Response) => {
  try {
    const { companyName, serviceType, contactName, email, phone } = req.body;

    if (!companyName || !serviceType || !contactName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const provider = await prisma.provider.create({
      data: {
        companyName,
        serviceType,
        contactName,
        email,
        phone,
        status: 'ACTIVE',
      },
    });

    return res.status(201).json(provider);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { companyName, serviceType, contactName, email, phone, status } = req.body;

    const provider = await prisma.provider.update({
      where: { id },
      data: { companyName, serviceType, contactName, email, phone, status },
    });

    return res.json(provider);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Provider not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const provider = await prisma.provider.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return res.json({ message: 'Provider deactivated', provider });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Provider not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
