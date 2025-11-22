import { Request, Response } from 'express';
import prisma from '../db.js';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { fullName, position, email, phone, hireDate } = req.body;

    if (!fullName || !position || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingEmployee = await prisma.employee.findUnique({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const employee = await prisma.employee.create({
      data: {
        fullName,
        position,
        email,
        phone,
        hireDate: new Date(hireDate),
        status: 'ACTIVE',
      },
    });

    return res.status(201).json(employee);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, position, phone, status } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: { fullName, position, phone, status },
    });

    return res.json(employee);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return res.json({ message: 'Employee deactivated', employee });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
