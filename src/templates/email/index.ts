import { User } from '@prisma/client';

const transferSuccessfully = (sender: User, receiver: User, amount: number) => {
  const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  return `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Transferência Confirmada</h2>
        </div>
        <div class="content">
            <p>Olá, <strong>${sender.name}</strong>,</p>
            <p>Sua transferência foi realizada com sucesso!</p>
            <p><strong>Detalhes da Transação:</strong></p>
            <ul>
                <li><strong>Valor:</strong> R$ ${currency}</li>
                <li><strong>Destinatário:</strong> ${receiver.name} | ${receiver.email}</li>
            </ul>
            <p>Se você tiver alguma dúvida ou precisar de assistência, entre em contato conosco.</p>
            <p>Obrigado por usar nossos serviços!</p>
        </div>
    </div>
</body>
</html>
`;
};

export const templateEmails = {
  transferSuccessfully,
};
