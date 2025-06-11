import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Supplier } from '@/types/financeiro';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, User, Phone, PhoneCall, Mail } from 'lucide-react';
import { validateCPF, validateCNPJ } from '@/utils/validators';

// Use the validators from utils
const validateDocument = (document: string, type: 'physical' | 'legal'): boolean => {
  const cleanDoc = document.replace(/\D/g, '');
  if (type === 'physical') {
    return validateCPF(cleanDoc);
  } else {
    return validateCNPJ(cleanDoc);
  }
};

// Schema for supplier form validation
const supplierSchema = z.object({
  businessName: z.string().min(1, { message: "Razão social é obrigatória" }),
  tradeName: z.string().optional().or(z.literal('')),
  type: z.enum(['physical', 'legal'], { 
    required_error: "Tipo de fornecedor é obrigatório" 
  }),
  document: z.string()
    .min(11, { message: "Documento deve ter pelo menos 11 dígitos (CPF) ou 14 dígitos (CNPJ)" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  contactPerson: z.string().optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  landlinePhone: z.string().optional().or(z.literal('')),
  mobilePhone: z.string().optional().or(z.literal('')),
  alternativeEmail: z.string().email({ message: "Email alternativo inválido" }).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  existingSuppliers?: Supplier[];
}

// Define the allowed field names type to fix the TypeScript error
type SupplierFormFields = keyof z.infer<typeof supplierSchema>;

const SupplierForm: React.FC<SupplierFormProps> = ({ 
  supplier,
  onSubmit, 
  onCancel,
  isLoading = false,
  existingSuppliers = []
}) => {
  // Initialize the form with default values or existing supplier data
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      businessName: supplier?.businessName || '',
      tradeName: supplier?.tradeName || '',
      type: supplier?.type || 'legal',
      document: supplier?.document || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      city: supplier?.city || '',
      state: supplier?.state || '',
      zipCode: supplier?.zipCode || '',
      contactPerson: supplier?.contactPerson || '',
      contactPhone: supplier?.contactPhone || '',
      website: supplier?.website || '',
      landlinePhone: supplier?.landlinePhone || '',
      mobilePhone: supplier?.mobilePhone || '',
      alternativeEmail: supplier?.alternativeEmail || '',
      notes: supplier?.notes || '',
    }
  });

  const handleSubmit = (data: z.infer<typeof supplierSchema>) => {
    // Validate document
    const isValidDoc = validateDocument(data.document, data.type);
    if (!isValidDoc) {
      form.setError('document', {
        type: 'manual',
        message: `${data.type === 'physical' ? 'CPF' : 'CNPJ'} inválido`
      });
      return;
    }

    // Check for duplicate documents
    const cleanDocument = data.document.replace(/\D/g, '');
    const isDuplicate = existingSuppliers.some(
      s => s.id !== supplier?.id && s.document.replace(/\D/g, '') === cleanDocument
    );
    
    if (isDuplicate) {
      form.setError('document', {
        type: 'manual',
        message: 'Já existe um fornecedor cadastrado com este documento'
      });
      return;
    }
    
    onSubmit(data);
  };

  // Handle document format based on supplier type
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const type = form.getValues('type');
    
    let formattedValue = value;
    
    if (type === 'physical' && value.length <= 11) {
      // Format as CPF: 123.456.789-01
      formattedValue = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (type === 'legal' && value.length <= 14) {
      // Format as CNPJ: 12.345.678/0001-90
      formattedValue = value
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    
    form.setValue('document', formattedValue);
    
    // Trigger validation on change
    if (formattedValue.length >= 11) {
      const isValid = validateDocument(formattedValue, type);
      if (!isValid) {
        form.setError('document', {
          type: 'manual',
          message: `${type === 'physical' ? 'CPF' : 'CNPJ'} inválido`
        });
      } else {
        // Clear document error by clearing all errors and re-triggering validation
        form.clearErrors();
        form.trigger();
      }
    }
  };

  // Check for duplicates on document blur
  const handleDocumentBlur = () => {
    const document = form.getValues('document');
    const type = form.getValues('type');
    const cleanDocument = document.replace(/\D/g, '');
    
    if (cleanDocument.length >= 11) {
      // Validate document format
      const isValid = validateDocument(document, type);
      if (!isValid) {
        form.setError('document', {
          type: 'manual',
          message: `${type === 'physical' ? 'CPF' : 'CNPJ'} inválido`
        });
        return;
      }

      // Check for duplicates
      const isDuplicate = existingSuppliers.some(
        s => s.id !== supplier?.id && s.document.replace(/\D/g, '') === cleanDocument
      );
      
      if (isDuplicate) {
        form.setError('document', {
          type: 'manual',
          message: 'Já existe um fornecedor cadastrado com este documento'
        });
      }
    }
  };

  // Format phone number - fixed to use the proper type
  const formatPhone = (e: React.ChangeEvent<HTMLInputElement>, fieldName: SupplierFormFields) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    form.setValue(fieldName, value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{supplier ? 'Editar' : 'Novo'} Fornecedor</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Razão social completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fantasia</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome fantasia (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear document field when changing type
                          form.setValue('document', '');
                          form.trigger();
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="physical">Pessoa Física</SelectItem>
                          <SelectItem value="legal">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.getValues('type') === 'physical' ? 'CPF' : 'CNPJ'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={form.getValues('type') === 'physical' ? '123.456.789-01' : '12.345.678/0001-90'}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDocumentChange(e);
                          }}
                          onBlur={(e) => {
                            field.onBlur(e);
                            handleDocumentBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email Principal</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Telefone Principal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 98765-4321" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              formatPhone(e, 'phone');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="alternativeEmail"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email Alternativo</FormLabel>
                        <FormControl>
                          <Input placeholder="alternative@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="landlinePhone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Telefone Fixo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 1234-5678" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              formatPhone(e, 'landlinePhone');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <FormField
                  control={form.control}
                  name="mobilePhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>WhatsApp/Celular</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 98765-4321" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            formatPhone(e, 'mobilePhone');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12345-678" 
                          {...field} 
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 8) {
                              value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2').trim();
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome do Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da pessoa para contato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Telefone do Contato</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 98765-4321" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              formatPhone(e, 'contactPhone');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações adicionais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button variant="outline" type="button" onClick={onCancel} className="mr-2">
          Cancelar
        </Button>
        <Button type="submit" onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
          {isLoading ? 'Salvando...' : (supplier ? 'Atualizar' : 'Criar')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupplierForm;

</initial_code>
