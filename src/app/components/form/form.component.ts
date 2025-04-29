import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from "jspdf";
@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule,],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent  {
  
  tiposDeRestaurante: any = null;
  cadastroForm!: FormGroup;
  enviado: boolean = false;

  respostasForm: { [key: string]: any } = {
    rodizioPizza: null,
    rodizioSushi: null,
    precoChurrascaria: null,
    tiposSistema: null,
  };
  

  alteraFormulario(event: any){
    
    console.log(event.target.value)
    this.tiposDeRestaurante = event.target.value
  }

  constructor(private fb: FormBuilder, private el: ElementRef<HTMLElement>){

  }

  ngOnInit(){
    this.cadastroForm = this.fb.group({
      texto: ['', Validators.required,],
      telefone: ['', [Validators.required, Validators.pattern('^[0-9()-]{11,15}$')]],
      email: ['',[Validators.required, Validators.pattern(('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'))]],
      endereco: ['', Validators.required],
      tipo: ['', Validators.required],
    })
  }
  onSubmit(){
    this.enviado = true;
    console.log(this.tiposDeRestaurante)
    if (this.cadastroForm.valid){
      this.gerarPDF();
    }
    else{
      console.log('Formulario inválido.')
      this.cadastroForm.markAllAsTouched();
    }
    
  }
  campoValidator(campo: string): boolean {
    const control = this.cadastroForm.get(campo);
    return control?.touched && control?.invalid ? true : false
    
  }
  verificaValor(event: any, pergunta: any){
   this.respostasForm[pergunta] = event.target.value;
   console.log(pergunta) 
  }
  
  gerarPDF(): void {
    
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
  
    const elements = this.el.nativeElement.querySelectorAll<HTMLElement>('h3, label.form-label');
    const restaurantData: any = {};
    elements.forEach(el => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
  
      if (el.tagName === 'H3') {
        doc.setFillColor(236, 240, 241);
        doc.rect(10, y - 4, pageWidth - 20, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(52, 73, 94);
        doc.text(el.innerText.trim(), 12, y);
        y += 12;
      } else {
        const question = el.innerText.trim();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(question, 12, y);
        y += 6;
  
        let control = el.nextElementSibling as HTMLElement | null;
        while (control && !['INPUT', 'SELECT', 'TEXTAREA'].includes(control.tagName)) {
          control = control.nextElementSibling as HTMLElement | null;
        }
  
        let answer = '(vazio)';
        if (control) {
          if (control.tagName === 'SELECT') {
            const sel = control as HTMLSelectElement;
            const opt = sel.options[sel.selectedIndex];
            answer = opt ? opt.text.trim() : '(vazio)';
          } else {
            answer = (control as HTMLInputElement | HTMLTextAreaElement).value.trim() || '(vazio)';
          }
        }
  
        
        restaurantData[question] = answer;
  
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(44, 62, 80);
        doc.text(answer, 14, y);
        y += 10;
      }
    });
    
    const lista = JSON.parse(localStorage.getItem('restaurantes') || '[]');
    lista.push(restaurantData);
    localStorage.setItem('restaurantes', JSON.stringify(lista));
    console.log('Lista de restaurantes no storage:', lista);
  
    
  
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }
  
    doc.save('ficha_restaurante.pdf');
  
    
    console.log('Dados do restaurante:', restaurantData);
  }
  
}
