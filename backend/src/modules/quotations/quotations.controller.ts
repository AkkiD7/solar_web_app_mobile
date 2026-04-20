import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendError } from '../../utils/response';
import * as quotationsService from './quotations.service';
import puppeteer from 'puppeteer';

const cid = (req: Request) => req.user!.companyId;
const uid = (req: Request) => req.user!.id;

export const createQuote = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg as string, 422);
  }
  const quote = await quotationsService.createQuote(cid(req), uid(req), req.body);
  sendSuccess(res, quote, 'Quote created successfully', 201);
};

export const getQuotes = async (req: Request, res: Response) => {
  const quotes = await quotationsService.getQuotes(cid(req));
  sendSuccess(res, quotes);
};

export const getQuotesByLead = async (req: Request, res: Response) => {
  const quotes = await quotationsService.getQuotesByLead(cid(req), req.params.leadId);
  sendSuccess(res, quotes);
};

export const getQuoteById = async (req: Request, res: Response) => {
  const quote = await quotationsService.getQuoteById(cid(req), req.params.id);
  sendSuccess(res, quote);
};

export const generatePdf = async (req: Request, res: Response) => {
  // Service handles data fetching + branding injection
  const html = await quotationsService.generatePdf(cid(req), req.params.id);

  // Get quote for filename
  const quote = await quotationsService.getQuoteById(cid(req), req.params.id);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="quote-${(quote as any).quoteNumber ?? (quote as any)._id}.pdf"`
    );
    res.send(pdf);
  } finally {
    await browser.close();
  }
};
