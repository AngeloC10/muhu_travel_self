import { Request, Response } from 'express';
import prisma from '../db.js';

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(packages);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const { name, description, price, durationDays, maxPax, destinations } = req.body;

    if (!name || !price || !durationDays || !maxPax) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pkg = await prisma.tourPackage.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
        maxPax: parseInt(maxPax),
        destinations: destinations || [],
      },
    });

    return res.status(201).json(pkg);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Package name already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, durationDays, maxPax, destinations } = req.body;

    const pkg = await prisma.tourPackage.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        durationDays: durationDays ? parseInt(durationDays) : undefined,
        maxPax: maxPax ? parseInt(maxPax) : undefined,
        destinations: destinations || undefined,
      },
    });

    return res.json(pkg);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Package not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Package name already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tourPackage.delete({ where: { id } });
    return res.json({ message: 'Package deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Package not found' });
    }
    if (error.code === 'P2014') {
      return res.status(400).json({ error: 'Cannot delete package with existing reservations' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
