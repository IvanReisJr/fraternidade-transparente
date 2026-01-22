import express from 'express';
import cors from 'cors';
import { PrismaClient, TransactionStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Middleware de Autenticação
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

// --- TRANSACTIONS ---
app.get('/transactions', authenticateToken, async (req: any, res) => {
    const status = req.query.status as TransactionStatus;
    const where = status ? { status } : {};

    try {
        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                unit: true,
                costCenter: true,
                createdByUser: {
                    select: { email: true, id: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

app.post('/transactions', authenticateToken, async (req: any, res) => {
    try {
        const data = req.body;
        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                createdByUserId: req.user.userId,
                status: 'PENDING'
            }
        });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
});

app.put('/transactions/:id/status', authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    const { status, reason } = req.body; // reason for rejection

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    try {
        const transaction = await prisma.transaction.update({
            where: { id: Number(id) },
            data: { status }
        });

        // Log auditoria
        await prisma.auditLog.create({
            data: {
                transactionId: transaction.id,
                auditorUserId: req.user.userId,
                action: status === 'APPROVED' ? 'APPROVE' : 'REJECT',
                reason: reason
            }
        });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
});

// --- UNITS ---
app.get('/units', authenticateToken, async (req, res) => {
    const units = await prisma.unit.findMany();
    res.json(units);
});

app.post('/units', authenticateToken, async (req, res) => {
    try {
        const unit = await prisma.unit.create({ data: req.body });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar unidade' });
    }
});

app.put('/units/:id', authenticateToken, async (req, res) => {
    try {
        const unit = await prisma.unit.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar unidade' });
    }
});

app.delete('/units/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.unit.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar unidade' });
    }
});

// --- COST CENTERS ---
app.get('/cost-centers', authenticateToken, async (req, res) => {
    const costCenters = await prisma.costCenter.findMany();
    res.json(costCenters);
});

app.post('/cost-centers', authenticateToken, async (req, res) => {
    try {
        const costCenter = await prisma.costCenter.create({ data: req.body });
        res.json(costCenter);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar centro de custo' });
    }
});

app.put('/cost-centers/:id', authenticateToken, async (req, res) => {
    try {
        const costCenter = await prisma.costCenter.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.json(costCenter);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar centro de custo' });
    }
});

app.delete('/cost-centers/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.costCenter.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar centro de custo' });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
