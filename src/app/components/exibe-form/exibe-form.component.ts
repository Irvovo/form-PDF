import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-exibe-form',
  imports: [CommonModule],
  templateUrl: './exibe-form.component.html',
  styleUrls: ['./exibe-form.component.css']
})
export class ExibeFormComponent implements OnInit {
  restaurantes: Array<Record<string, string>> = [];

  ngOnInit(): void {
  
    this.restaurantes = JSON.parse(localStorage.getItem('restaurantes') || '[]');
  }

  excluirRestaurante(index: number): void {
   
    this.restaurantes.splice(index, 1);
    localStorage.setItem('restaurantes', JSON.stringify(this.restaurantes));
  }

  gerarPDF(restaurant: Record<string, string>): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Ficha de Restaurante', pageWidth / 2, y, { align: 'center' });
    y += 15;

    
    doc.setDrawColor(236, 240, 241);
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

 
    for (const [question, answer] of Object.entries(restaurant)) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

     
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(41, 128, 185);
      doc.text(question, 12, y);
      y += 6;

     
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text(answer || '(vazio)', 14, y);
      y += 10;
    }

   
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    
    const filename = (restaurant['Nome do Restaurante'] || 'ficha_restaurante') + '.pdf';
    doc.save(filename);
  }
}