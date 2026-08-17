import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_state.dart';
import 'screens/login_screen.dart';
import 'screens/binder_list_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthState()..checkSession(),
      child: const CardCaptorApp(),
    ),
  );
}

class CardCaptorApp extends StatelessWidget {
  const CardCaptorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CardCaptor',
      theme: ThemeData(colorSchemeSeed: Colors.deepPurple, useMaterial3: true),
      home: const _RootRouter(),
    );
  }
}

class _RootRouter extends StatelessWidget {
  const _RootRouter();

  @override
  Widget build(BuildContext context) {
    final status = context.watch<AuthState>().status;
    switch (status) {
      case AuthStatus.unknown:
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      case AuthStatus.loggedOut:
        return const LoginScreen();
      case AuthStatus.loggedIn:
        return const BinderListScreen();
    }
  }
}
