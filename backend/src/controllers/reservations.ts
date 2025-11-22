import { Request, Response } from 'express';
import prisma from '../db.js';

export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        package: true,
        client: true,
        passengers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const {
      packageId,
      clientId,
      travelDate,
      adultCount,
      passengers,
      totalAmount,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!packageId || !clientId || !travelDate || !adultCount || !passengers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate reservation code
    const count = await prisma.reservation.count();
    const year = new Date().getFullYear();
    const reservationCode = `RES-${year}-${String(count + 1).padStart(4, '0')}`;

    const reservation = await prisma.reservation.create({
      data: {
        reservationCode,
        packageId,
        clientId,
        travelDate: new Date(travelDate),
        adultCount,
        totalAmount: parseFloat(totalAmount),
        status: 'CONFIRMED',
        paymentMethod,
        couponCode,
        passengers: {
          create: passengers.map((p: any) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            nationality: p.nationality,
            docType: p.docType,
            docNumber: p.docNumber,
            birthDate: new Date(p.birthDate),
            gender: p.gender,
          })),
        },
      },
      include: {
        package: true,
        client: true,
        passengers: true,
      },
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        package: true,
        client: true,
        passengers: true,
      },
    });

    return res.json(reservation);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.reservation.delete({ where: { id } });
    return res.json({ message: 'Reservation deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
